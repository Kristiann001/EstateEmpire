import React, { useEffect, useState } from 'react';
import axios from 'axios';
import formatPrice from './utilis';
import { useNavigate } from 'react-router-dom';


function Purchased() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      const token = localStorage.getItem('token');

      // Check if token exists
      if (!token) {
        // If no token, redirect to login page
        navigate('/login');
        return;
      }

  try {
    const response = await axios.get('https://estateempire-backend.onrender.com/purchases', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setPurchases(response.data.purchases);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching Purchases:', err);
    if (err.response && err.response.status === 401) {
      // If unauthorized, redirect to login page
      navigate('/login');
    } else {
      setError('Failed to fetch Purchases. Please try again later.');
      setLoading(false);
    }
  }
};

fetchPurchases();
  }, [navigate]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">My Purchases</h1>
      {purchases.length === 0 ? (
        <p>You haven't made any purchases yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{purchase.property.name}</h2>
              <p className="text-gray-600 mb-2">{purchase.property.location}</p>
              <p className="text-green-600 font-bold mb-2">Price: Ksh {formatPrice(purchase.property.price)}</p>
              <p className="text-sm text-gray-500">Purchased on: {new Date(purchase.purchased_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Purchased;