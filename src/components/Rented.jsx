import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, addDays, differenceInDays } from 'date-fns';
import formatPrice from './utilis';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

function Rented() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/rentals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRentals(response.data.purchases);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch rentals. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchRentals();
  }, [navigate]);

  const calculateCountdown = (rentedDate) => {
    const dueDate = addDays(new Date(rentedDate), 30);
    const today = new Date();
    const daysLeft = differenceInDays(dueDate, today);

    if (daysLeft < 0) {
      return { text: "Rent due", status: "overdue" };
    } else if (daysLeft <= 5) {
      return { text: `${daysLeft} days left`, status: "warning" };
    } else {
      return { text: `${daysLeft} days left`, status: "good" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
          <h1 className="text-4xl font-bold text-gray-900 font-outfit mb-2">My Rentals</h1>
          <p className="text-gray-500">Track your active rental properties and payment schedules</p>
        </div>

        {rentals.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHome className="text-3xl text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-outfit">No Active Rentals</h3>
            <p className="text-gray-500 mb-6">You haven't rented any properties yet.</p>
            <button
              onClick={() => navigate('/rent')}
              className="btn-premium bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30"
            >
              Browse Rentals
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => {
              const countdown = calculateCountdown(rental.rented_at);
              return (
                <div key={rental.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                  <div className="relative h-48">
                    <img
                      src={rental.property.image || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1470&auto=format&fit=crop"}
                      alt={rental.property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 font-outfit">{rental.property.name}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-indigo-600" />
                        <span>{rental.property.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-indigo-600" />
                        <span>Started {format(new Date(rental.rented_at), 'PP')}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400 uppercase font-bold">Monthly Rent</span>
                        <span className="text-lg font-bold text-indigo-600">KSh {formatPrice(rental.property.price)}</span>
                      </div>
                      
                      <div className={`flex items-center gap-2 p-3 rounded-2xl ${
                        countdown.status === 'overdue' ? 'bg-red-50' : 
                        countdown.status === 'warning' ? 'bg-yellow-50' : 'bg-green-50'
                      }`}>
                        <FaClock className={`${
                          countdown.status === 'overdue' ? 'text-red-600' : 
                          countdown.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                        <span className={`text-sm font-bold ${
                          countdown.status === 'overdue' ? 'text-red-600' : 
                          countdown.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {countdown.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rented;
