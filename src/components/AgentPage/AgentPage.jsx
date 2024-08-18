import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaImage, FaBed, FaBath } from 'react-icons/fa';
import '../AgentPage/AgentPage.css';
import PaymentsTable from '../AgentPage/PaymentsTable';
import { useNavigate } from 'react-router-dom';

const AgentPage = () => {
    const [propertyType, setPropertyType] = useState(''); 
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [units, setUnits] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [bedrooms, setBedrooms] = useState(''); 
    const [bathrooms, setBathrooms] = useState(''); 
    const [amenities, setAmenities] = useState(''); 
    const [listings, setListings] = useState([]);
    const [payments, setPayments] = useState([]);  
    const [dropdownOptions, setDropdownOptions] = useState({
        propertyTypes: [],
    });

    const navigate = useNavigate();
    useEffect(() => {
        const role = localStorage.getItem('role');

        if (role !== 'Agent') {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/unit_types');
                setDropdownOptions(response.data);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };

        const fetchListings = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/properties');
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/rental-payments');
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchDropdownOptions();
        fetchListings();
        fetchPayments();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            name: name,
            type: type,
            price: price,
            location: location,
            description: description,
            units: units || null,
            bedrooms: bedrooms || null, 
            bathrooms: bathrooms || null, 
            amenities: amenities || null,
            image: imageURL || null,
            status: 'AVAILABLE',
            unit_type_id: dropdownOptions.propertyTypes.find(option => option.name === type)?.id,
            user_id: 1
        };

        try {
            const endpoint = propertyType === 'rent' ? '/properties/for-rent' : '/properties/for-sale';
            await axios.post(`http://127.0.0.1:5000${endpoint}`, formData);

            window.location.reload();
        } catch (error) {
            console.error('Error adding listing:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/properties/${id}`);
            setListings(listings.filter(listing => listing.id !== id));
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    return (
        <div className="agent-page">
            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    <h2 className="form-title">Add a Listing</h2>
                    <div className="tab-container">
    <button
        className={`tab ${propertyType === 'rent' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600'} px-4 py-2 rounded-lg`}
        type="button"
        onClick={() => setPropertyType('rent')}
    >
        For Rent
    </button>
    <button
        className={`tab ${propertyType === 'buy' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600'} px-4 py-2 rounded-lg ml-2`}
        type="button"
        onClick={() => setPropertyType('buy')}
    >
        For Buy
    </button>
    <div className="indicator"></div>
</div>

                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Select Type</option>
                                {dropdownOptions.propertyTypes.map((unit_type) => (
                                    <option key={unit_type.id} value={unit_type.name}>
                                        {unit_type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        {propertyType === 'rent' && (
                            <div className="form-group">
                                <label htmlFor="units">Number of Units</label>
                                <input
                                    type="number"
                                    id="units"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="bedrooms"><FaBed className="input-icon" /></label>
                            <input
                                type="number"
                                id="bedrooms"
                                value={bedrooms}
                                onChange={(e) => setBedrooms(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bathrooms"><FaBath className="input-icon" /></label>
                            <input
                                type="number"
                                id="bathrooms"
                                value={bathrooms}
                                onChange={(e) => setBathrooms(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="amenities">Amenities</label>
                        <input
                            type="text"
                            id="amenities"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageURL">Image URL <FaImage className="input-icon" /></label>
                        <input
                            type="text"
                            id="imageURL"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn">Add Listing</button>
                </form>
            </div>
            <div className="listings-table">
                <h2 className="listings-title">My Listings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Units</th>
                            <th>Bedrooms</th>
                            <th>Bathrooms</th>
                            <th>Amenities</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => (
                            <tr key={listing.id}>
                                <td>{listing.name}</td>
                                <td>{listing.type}</td>
                                <td>{listing.price}</td>
                                <td>{listing.location}</td>
                                <td>{listing.description}</td>
                                <td>{listing.units}</td>
                                <td>{listing.bedrooms}</td>
                                <td>{listing.bathrooms}</td>
                                <td>{listing.amenities}</td>
                                <td>
                                    {listing.imageURL && <img src={listing.imageURL} alt="Property" width="100" />}
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(listing.id)} className="btn-delete"><FaTrashAlt /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <PaymentsTable payments={payments} propertyType={propertyType} /> */}
        </div>
    );
};

export default AgentPage;
