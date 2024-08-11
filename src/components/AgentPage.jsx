import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBed, FaBath, FaTrashAlt } from 'react-icons/fa';
const AgentPage = () => {
    const [propertyType, setPropertyType] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState(null);
    const [listings, setListings] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState({
        propertyTypes: [],
        bathrooms: [],
        bedrooms: []
    });

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const response = await axios.get('/api/dropdown-options');
                setDropdownOptions(response.data);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };

        const fetchListings = async () => {
            try {
                const response = await axios.get('/api/listings');
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchDropdownOptions();
        fetchListings();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('propertyType', propertyType);
        formData.append('bathrooms', bathrooms);
        formData.append('bedrooms', bedrooms);
        formData.append('price', price);
        formData.append('location', location);
        if (images) {
            Array.from(images).forEach(image => {
                formData.append('images', image);
            });
        }

        try {
            const response = await axios.post('/api/add-listing', formData);
            setListings([...listings, response.data]);
        } catch (error) {
            console.error('Error adding listing:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/delete-listing/${id}`);
            setListings(listings.filter(listing => listing.id !== id));
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    return (
        <div className="agent-page">
            <nav className="navbar">
                <span className="navbar-brand">EstateEmpire</span>
            </nav>
            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    <h2 className="form-title">Add a Listing</h2>
                    <div className="tab-container">
                        <button className="tab tab--1" type="button" onClick={() => setPropertyType('rent')}>For Rent</button>
                        <button className="tab tab--2" type="button" onClick={() => setPropertyType('buy')}>For Buy</button>
                        <div className="indicator"></div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="propertyType">Property Type</label>
                        {/* <select id="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                            {dropdownOptions.propertyTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select> */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="bathrooms"><FaBath className="input-icon" /> Bathrooms</label>
                        {/* <select id="bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
                            {dropdownOptions.bathrooms.map((bathroom) => (
                                <option key={bathroom} value={bathroom}>{bathroom}</option>
                            ))}
                        </select> */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="bedrooms"><FaBed className="input-icon" /> Bedrooms</label>
                        {/* <select id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                            {dropdownOptions.bedrooms.map((bedroom) => (
                                <option key={bedroom} value={bedroom}>{bedroom}</option>
                            ))}
                        </select> */}
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="images">Images</label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            onChange={(e) => setImages(e.target.files)}
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
                            <th>Property Type</th>
                            <th>Bathrooms</th>
                            <th>Bedrooms</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {listings.map((listing) => (
                            <tr key={listing.id}>
                                <td>{listing.propertyType}</td>
                                <td><FaBath className="fa-icon" /> {listing.bathrooms}</td>
                                <td><FaBed className="fa-icon" /> {listing.bedrooms}</td>
                                <td>{listing.price}</td>
                                <td>{listing.location}</td>
                                <td>
                                    {listing.images.map((image, index) => (
                                        <img key={index} src={image} alt="Property" width="100" />
                                    ))}
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(listing.id)} className="btn-delete"><FaTrashAlt /></button>
                                </td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentPage;
