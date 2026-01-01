import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function seed() {
    try {
        console.log('🌱 Starting Seed Process...');

        // 1. Create Agent
        let agentToken;
        try {
            const res = await axios.post(`${BASE_URL}/auth/signup`, {
                email: 'agent@estate.com',
                password: 'password123',
                contact: '0700000000',
                role: 'Agent'
            });
            console.log('✅ Agent Created');
        } catch (e) {
            console.log('ℹ️ Agent might already exist, trying login...');
        }

        // Login Agent
        const agentLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'agent@estate.com',
            password: 'password123'
        });
        agentToken = agentLogin.data.token;
        console.log('✅ Agent Logged In');

        // 2. Create Properties
        const properties = [
            {
                name: 'Modern Loft in Westlands',
                type: 'for_rent',
                price: 85000,
                location: 'Westlands, Nairobi',
                description: 'A spacious modern loft with city views.',
                bedrooms: 2,
                bathrooms: 2,
                status: 'AVAILABLE'
            },
            {
                name: 'Luxury Villa in Karen',
                type: 'for_sale',
                price: 45000000,
                location: 'Karen, Nairobi',
                description: '5 bedroom villa with a swimming pool and large garden.',
                bedrooms: 5,
                bathrooms: 6,
                status: 'AVAILABLE'
            },
             {
                name: 'Coziest Apartment in Kilimani',
                type: 'for_rent',
                price: 60000,
                location: 'Kilimani, Nairobi',
                description: 'Close to Yaya Center, secure and fully furnished.',
                bedrooms: 1,
                bathrooms: 1,
                status: 'AVAILABLE'
            }
        ];

        for (const prop of properties) {
            try {
                // Determine endpoint based on type, mimicking frontend logic or just use correct one if backend allows
                // My backend route is POST /properties/for-rent OR /properties/for-sale
                const endpoint = prop.type === 'for_rent' ? '/properties/for-rent' : '/properties/for-sale';
                await axios.post(`${BASE_URL}${endpoint}`, prop, {
                    headers: { Authorization: `Bearer ${agentToken}` }
                });
                console.log(`✅ Property Created: ${prop.name}`);
            } catch (e) {
                 console.log(`❌ Failed to create ${prop.name}:`, e.message);
            }
        }

        // 3. Create Customer
        try {
             await axios.post(`${BASE_URL}/auth/signup`, {
                email: 'client@estate.com',
                password: 'password123',
                contact: '0711111111',
                role: 'Client'
            });
             console.log('✅ Customer Created');
        } catch (e) {
             console.log('ℹ️ Customer might already exist');
        }
        
        console.log('\n🎉 Seeding Complete!');
        console.log('Use these credentials to test:');
        console.log('Agent: agent@estate.com / password123');
        console.log('Client: client@estate.com / password123');

    } catch (error) {
        console.error('❌ Seeding Failed:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

seed();
