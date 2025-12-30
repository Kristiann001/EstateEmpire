import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaImage, FaBed, FaBath, FaMapMarkerAlt, FaPlus, FaCogs, FaChartLine, FaHome } from 'react-icons/fa';
import '../AgentPage/AgentPage.css';
import PaymentsTable from '../AgentPage/PaymentsTable';
import { useNavigate } from 'react-router-dom';

const AgentPage = () => {
    const [propertyType, setPropertyType] = useState('rent'); 
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                const response = await axios.get('http://localhost:5000/unit_types');
                setDropdownOptions(response.data);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };

        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/properties');
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
        
        const formData = {
            name: name,
            type: propertyType === 'rent' ? 'for_rent' : 'for_sale',
            price: parseInt(price),
            location: location,
            description: description,
            units: units ? parseInt(units) : null,
            bedrooms: bedrooms ? parseInt(bedrooms) : null, 
            bathrooms: bathrooms ? parseInt(bathrooms) : null, 
            amenities: amenities || null,
            image: imageURL || null,
            status: 'AVAILABLE',
            unit_type_id: dropdownOptions.propertyTypes.find(option => option.name === type)?.id || 1,
        };

        try {
            const endpoint = propertyType === 'rent' ? '/properties/for-rent' : '/properties/for-sale';
            await axios.post(`http://localhost:5000${endpoint}`, formData);
            // Reset form
            setName(''); setPrice(''); setLocation(''); setDescription(''); setUnits(''); setBedrooms(''); setBathrooms(''); setAmenities(''); setImageURL('');
            // Refresh listings
            const response = await axios.get('http://localhost:5000/properties');
            setListings(response.data);
        } catch (error) {
            console.error('Error adding listing:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axios.delete(`http://localhost:5000/properties/${id}`);
            setListings(listings.filter(listing => listing.id !== id));
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex pt-24">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-100 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col`}>
                <div className="p-6">
                    <h2 className={`font-bold text-blue-600 transition-all ${isSidebarOpen ? 'text-xl' : 'text-xs text-center'}`}>
                        {isSidebarOpen ? 'Agent Panel' : 'AP'}
                    </h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-600 font-semibold">
                        <FaChartLine />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                        <FaHome />
                        {isSidebarOpen && <span>My Listings</span>}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-outfit">Property Dashboard</h1>
                            <p className="text-gray-500">Manage your real estate catalog</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <FaHome className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Total Listings</p>
                                    <p className="text-xl font-bold text-gray-900">{listings.length}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Column */}
                        <div className="lg:col-span-1">
                            <div className="glass-card p-8 rounded-3xl sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-outfit">Add New Listing</h3>
                                
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {/* Property Type Toggle */}
                                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                        <button 
                                            type="button"
                                            onClick={() => setPropertyType('rent')}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${propertyType === 'rent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                        >
                                            Rent
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setPropertyType('buy')}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${propertyType === 'buy' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                        >
                                            Sale
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Property Name</label>
                                        <input 
                                            value={name} onChange={(e) => setName(e.target.value)} required
                                            className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="e.g. Ocean View Apartment"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Type</label>
                                            <select 
                                                value={type} onChange={(e) => setType(e.target.value)} required
                                                className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                            >
                                                <option value="">Select</option>
                                                {dropdownOptions.propertyTypes.map(pt => (
                                                    <option key={pt.id} value={pt.name}>{pt.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Price</label>
                                            <input 
                                                type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
                                                className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="KSh"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Location</label>
                                        <input 
                                            value={location} onChange={(e) => setLocation(e.target.value)} required
                                            className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Nairobi, Westlands"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bedrooms</label>
                                            <input 
                                                type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bathrooms</label>
                                            <input 
                                                type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Image URL</label>
                                        <input 
                                            value={imageURL} onChange={(e) => setImageURL(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
                                        <textarea 
                                            value={description} onChange={(e) => setDescription(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
                                            placeholder="Tell us about the property..."
                                        />
                                    </div>

                                    <button type="submit" className="btn-premium w-full py-4 mt-4">
                                        <FaPlus />
                                        Create Listing
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Listings Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 font-outfit">My Active Listings</h3>
                            {listings.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <FaHome className="text-2xl" />
                                    </div>
                                    <p className="text-gray-500">No listings found. Start by adding one!</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {listings.map((listing) => (
                                        <div key={listing.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                                            <div className="relative h-48">
                                                <img 
                                                    src={listing.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop"} 
                                                    alt={listing.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button 
                                                        onClick={() => handleDelete(listing.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                                    >
                                                        <FaTrashAlt className="text-sm" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-4 left-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${listing.type === 'for_rent' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                                                        {listing.type === 'for_rent' ? 'Rent' : 'Sale'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-gray-900 truncate">{listing.name}</h4>
                                                    <p className="text-blue-600 font-bold">KSh {listing.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                                                    <FaMapMarkerAlt />
                                                    {listing.location}
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-400 uppercase font-medium">Beds</p>
                                                        <p className="font-bold text-gray-700">{listing.bedrooms || '-'}</p>
                                                    </div>
                                                    <div className="text-center border-x border-gray-50">
                                                        <p className="text-xs text-gray-400 uppercase font-medium">Baths</p>
                                                        <p className="font-bold text-gray-700">{listing.bathrooms || '-'}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-400 uppercase font-medium">Status</p>
                                                        <p className="text-[10px] font-bold text-green-500 uppercase">{listing.status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AgentPage;
