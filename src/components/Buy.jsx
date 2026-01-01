import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import formatPrice from './utilis';
import { FaSearch, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';
import PurchaseModal from './PurchaseModal';
import toast from 'react-hot-toast';

export default function Buy() {
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/properties/for-sale')
            .then(response => {
                setPurchases(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the purchases!', error);
                setLoading(false);
            });
    }, []);

    const handleBuyClick = (e, property) => {
        e.preventDefault(); // Prevent Link navigation if button is inside
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const handleTransaction = async (phoneNumber) => {
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (!token) {
                 toast.error("Please login first");
                 return;
            }
            if (role === 'Agent') {
                toast.error("Agents cannot purchase properties. Please use a Client account.");
                return;
            }

            await axios.post('http://localhost:5000/transactions', {
                propertyId: selectedProperty.id,
                type: 'BUY',
                mpesa_code: phoneNumber // Simulating code with phone number
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`Payment initiated for ${selectedProperty.name}. Check your phone.`);
            setIsModalOpen(false);
            // Optionally refresh or redirect
        } catch (error) {
            console.error('Transaction failed:', error);
            toast.error('Transaction failed');
        }
    };

    const filteredPurchases = purchases.filter(purchase =>
        purchase.name.toLowerCase().includes(search.toLowerCase()) ||
        purchase.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Search Area */}
            <div className="bg-white border-b border-gray-100 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-outfit">Properties for Sale</h1>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto">Discover exclusive homes and investment opportunities in Kenya&apos;s prime locations.</p>
                    
                    <div className="relative max-w-2xl mx-auto">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredPurchases.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-500">No properties found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPurchases.map((purchase) => (
                            <Link 
                                to={`/purchase/${purchase.id}`} 
                                key={purchase.id} 
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        src={purchase.image || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400&auto=format&fit=crop"}
                                        alt={purchase.name}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            For Sale
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-blue-600 font-bold shadow-sm">
                                        KSh {formatPrice(purchase.price)}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h5 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors font-outfit">
                                        {purchase.name}
                                    </h5>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        {purchase.location}
                                    </div>
                                    
                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-50 text-gray-600 mt-auto mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaBed className="text-gray-300" />
                                            <span className="text-sm font-semibold">{purchase.bedrooms || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaBath className="text-gray-300" />
                                            <span className="text-sm font-semibold">{purchase.bathrooms || '-'}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={(e) => handleBuyClick(e, purchase)}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <PurchaseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleTransaction} 
            />
        </div>
    );
}
