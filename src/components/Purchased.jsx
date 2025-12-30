import React, { useEffect, useState } from 'react';
import axios from 'axios';
import formatPrice from './utilis';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaKey } from 'react-icons/fa';

function Purchased() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/purchases', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPurchases(response.data.purchases);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Purchases:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch Purchases. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchPurchases();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 font-outfit mb-2">My Purchases</h1>
          <p className="text-gray-500">Your owned properties and investment portfolio</p>
        </div>

        {purchases.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaKey className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-outfit">No Properties Owned</h3>
            <p className="text-gray-500 mb-6">You haven't made any purchases yet.</p>
            <button
              onClick={() => navigate('/buy')}
              className="btn-premium"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="relative h-48">
                  <img
                    src={purchase.property.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop"}
                    alt={purchase.property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                      <FaCheckCircle className="text-xs" />
                      Owned
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 font-outfit">{purchase.property.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{purchase.property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-blue-600" />
                      <span>Purchased {new Date(purchase.purchased_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase font-bold">Purchase Price</span>
                      <span className="text-lg font-bold text-blue-600">KSh {formatPrice(purchase.property.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Purchased;