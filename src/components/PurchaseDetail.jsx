import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PurchaseModal from './PurchaseModal';
import formatPrice from './utilis';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaBed, FaBath, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

export default function PurchaseDetail() {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:5000/properties/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setPurchase(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the property details!', error);
            });
    }, [id]);

    const handlePurchase = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (phoneNumber) => {
        setIsModalOpen(false);
        const token = localStorage.getItem('token');
        
        try {
            await axios.post('http://localhost:5000/transactions', {
                propertyId: parseInt(id),
                type: 'BUY',
                mpesa_code: phoneNumber
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Payment initiated! Check your phone.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed to initiate.');
        }
    };

    if (!purchase) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left: Image Section */}
                    <div className="animate-fade-in">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                            <img
                                className="w-full h-full object-cover"
                                src={purchase.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop"}
                                alt={purchase.name}
                            />
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block border border-blue-100">
                                Exclusive Sale
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">{purchase.name}</h1>
                            <div className="flex items-center gap-2 text-gray-500 mb-8">
                                <FaMapMarkerAlt className="text-blue-600" />
                                <span className="text-lg">{purchase.location}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaBed /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Bedrooms</p>
                                        <p className="font-bold text-gray-900">{purchase.bedrooms || '-'}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaBath /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Bathrooms</p>
                                        <p className="font-bold text-gray-900">{purchase.bathrooms || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 font-outfit">Detailed Description</h3>
                                <p className="text-gray-600 leading-relaxed italic">
                                    {purchase.description}
                                </p>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-3xl flex items-center justify-between border border-white/50 shadow-xl">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Asking Price</p>
                                <p className="text-3xl font-bold text-blue-600 font-outfit">KSh {formatPrice(purchase.price)}</p>
                            </div>
                            {(() => {
                                const role = localStorage.getItem('role');
                                const isLoggedIn = localStorage.getItem('token');
                                
                                if (!isLoggedIn) {
                                    return (
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-2">Sign in to purchase</p>
                                            <button
                                                onClick={() => window.location.href = '/login'}
                                                className="btn-premium px-10"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    );
                                }
                                
                                if (role !== 'Customer') {
                                    return (
                                        <div className="text-center px-6">
                                            <p className="text-xs text-gray-400 mb-1">Purchases restricted to</p>
                                            <p className="text-sm font-bold text-gray-600">Customer accounts</p>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <button
                                        className="btn-premium px-10"
                                        onClick={handlePurchase}
                                    >
                                        Secure Purchase
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16 rounded-3xl overflow-hidden border-2 border-white shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.364476462935!2d36.79054473089192!3d-1.268124626700715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0xad2c84df1f7f2ec8!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1723993461840!5m2!1sen!2ske"
                        className="w-full h-[400px]"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>

            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}
