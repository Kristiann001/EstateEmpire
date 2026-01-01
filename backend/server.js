const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'estate_empire_secret_key_change_me';

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// Models
const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('Agent', 'Client'), allowNull: false } // 'Agent' or 'Client'
});

const Property = sequelize.define('Property', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('for_rent', 'for_sale'), allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING }, // URL or path
    bedrooms: { type: DataTypes.INTEGER },
    bathrooms: { type: DataTypes.INTEGER },
    units: { type: DataTypes.INTEGER, defaultValue: 1 },
    amenities: { type: DataTypes.STRING }, // JSON string or comma-separated
    status: { type: DataTypes.ENUM('AVAILABLE', 'RENTED', 'SOLD'), defaultValue: 'AVAILABLE' }
});

const Transaction = sequelize.define('Transaction', {
    type: { type: DataTypes.ENUM('RENT', 'BUY'), allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    mpesa_code: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'), defaultValue: 'COMPLETED' }, // Simulating instant success
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Relationships
User.hasMany(Property, { foreignKey: 'agentId' });
Property.belongsTo(User, { as: 'Agent', foreignKey: 'agentId' });

User.hasMany(Transaction);
Transaction.belongsTo(User);

Property.hasMany(Transaction);
Transaction.belongsTo(Property);

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// --- Auth ---
// --- Auth ---
app.post('/auth/signup', async (req, res) => {
    try {
        const { email, password, contact, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, contact, role });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET_KEY);
            res.json({ token, role: user.role, userId: user.id, name: user.email });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.post('/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Simulate creating a reset token (in reality, store this in DB with expiry)
        // For simulation, we'll just sign a token that expires in 15m
        const resetToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '15m' });
        
        // Log to console for simulation
        console.log(`[SIMULATION] Password Reset Link for ${email}: http://localhost:5173/reset-password?token=${resetToken}`);

        res.json({ message: 'Reset link sent to your email (check server console)' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

app.post('/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ message: 'Missing token or password' });

        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) return res.status(400).json({ message: 'Invalid or expired token' });

            const user = await User.findByPk(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
});

// --- Unit Types (for dropdowns) ---
// Just mocking this for now to match AgentPage.jsx expectations if needed,
// though AgentPage hardcodes some logic.
app.get('/unit_types', (req, res) => {
    res.json({
        propertyTypes: [
            { id: 1, name: 'Apartment' },
            { id: 2, name: 'House' },
            { id: 3, name: 'Villa' },
            { id: 4, name: 'Land' },
            { id: 5, name: 'Commercial' }
        ]
    });
});


// --- Properties ---
app.get('/properties', async (req, res) => {
    try {
        const properties = await Property.findAll({ 
            where: { status: 'AVAILABLE' },
            include: [{ model: User, as: 'Agent', attributes: ['email', 'contact'] }]
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

app.get('/properties/for-rent', async (req, res) => {
    try {
        const properties = await Property.findAll({ 
            where: { status: 'AVAILABLE', type: 'for_rent' },
            include: [{ model: User, as: 'Agent', attributes: ['email', 'contact'] }]
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

app.get('/properties/for-sale', async (req, res) => {
    try {
        const properties = await Property.findAll({ 
            where: { status: 'AVAILABLE', type: 'for_sale' },
            include: [{ model: User, as: 'Agent', attributes: ['email', 'contact'] }]
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

app.get('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [{ model: User, as: 'Agent', attributes: ['email', 'contact'] }]
        });
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property' });
    }
});

// Agent Only: Create Property
app.post(['/properties/for-rent', '/properties/for-sale'], authenticateToken, async (req, res) => {
    if (req.user.role !== 'Agent') return res.status(403).json({ message: 'Agents only' });
    try {
        const property = await Property.create({ ...req.body, agentId: req.user.id });
        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ message: 'Error creating property', error: error.message });
    }
});

// Agent Only: Delete
app.delete('/properties/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Agent') return res.status(403).json({ message: 'Agents only' });
    try {
        const property = await Property.findOne({ where: { id: req.params.id, agentId: req.user.id } });
        if (!property) return res.status(404).json({ message: 'Property not found or unauthorized' });
        await property.destroy();
        res.json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property' });
    }
});

// Agent Only: Update
app.put('/properties/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Agent') return res.status(403).json({ message: 'Agents only' });
    try {
        const property = await Property.findOne({ where: { id: req.params.id, agentId: req.user.id } });
        if (!property) return res.status(404).json({ message: 'Property not found or unauthorized' });
        
        await property.update(req.body);
        res.json({ message: 'Property updated', property });
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
});

// --- Transactions (Buy/Rent with Mpesa Simulation) ---
app.post('/transactions', authenticateToken, async (req, res) => {
    // 1. Authorization: Only Clients can buy/rent
    if (req.user.role !== 'Client') {
        return res.status(403).json({ message: 'Agents cannot perform transactions.' });
    }

    const { propertyId, type, mpesa_code } = req.body;
    try {
        const property = await Property.findByPk(propertyId);
        if (!property || property.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Property not available' });
        }

        // Simulate Mpesa Verification
        // In a real app, we'd hit the Daraja API here.
        if (!mpesa_code || mpesa_code.length < 5) {
            return res.status(400).json({ message: 'Invalid Mpesa Code' });
        }

        const transaction = await Transaction.create({
            type,
            amount: property.price,
            mpesa_code,
            status: 'COMPLETED',
            UserId: req.user.id,
            PropertyId: property.id
        });

        // Update Property Status
        property.status = type === 'BUY' ? 'SOLD' : 'RENTED';
        await property.save();

        res.status(201).json({ message: 'Transaction successful', transaction });

    } catch (error) {
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
});

// Customer - Purchases
app.get('/purchases', authenticateToken, async (req, res) => {
    try {
        const purchases = await Transaction.findAll({
            where: { UserId: req.user.id, type: 'BUY' },
            include: [{ model: Property }]
        });
        // Frontend expects response.data.purchases
        // Also frontend uses 'purchased_at' which is 'createdAt' in sequelize by default, let's look at Rented.jsx
        // Rented.jsx uses 'rented_at'. Transaction has 'date'.
        // I should stick to what I defined or map it.
        // My Transaction model has 'date' field.
        // Let's alias it or just use return raw.
        const mapped = purchases.map(p => ({
            ...p.toJSON(),
            purchased_at: p.date
        }));

        res.json({ purchases: mapped });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases' });
    }
});

// Customer - Rentals
app.get('/rentals', authenticateToken, async (req, res) => {
    try {
        const rentals = await Transaction.findAll({
            where: { UserId: req.user.id, type: 'RENT' },
            include: [{ model: Property }]
        });
        const mapped = rentals.map(r => ({
            ...r.toJSON(),
            rented_at: r.date
        }));
        res.json({ purchases: mapped }); // Rented.jsx uses response.data.purchases (variable name logic reuse?)
        // Wait, Rented.jsx line 29: setRentals(response.data.purchases);
        // Yes, it expects 'purchases' key even for rentals.
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rentals' });
    }
});

// Agent Only: My Listings
app.get('/properties/my-listings', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Agent') return res.status(403).json({ message: 'Agents only' });
    try {
        const properties = await Property.findAll({ 
            where: { agentId: req.user.id }, 
            include: [{ model: User, as: 'Agent', attributes: ['email', 'contact'] }]
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties' });
    }
});


// Sync Database and Start Server
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Database sync error:', err));
