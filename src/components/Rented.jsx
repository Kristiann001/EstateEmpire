import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, addDays, differenceInDays } from 'date-fns';
import formatPrice from './utilis';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


function Rented() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRentals = async () => {
      const token = localStorage.getItem('token');

      // Check if token exists
      if (!token) {
        // If no token, redirect to login page
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://estateempire-backend.onrender.com/rentals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRentals(response.data.purchases);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        if (err.response && err.response.status === 401) {
          // If unauthorized, redirect to login page
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
      return "Rent due";
    } else {
      return `${daysLeft} days left`;
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">My Rentals</h1>
      {rentals.length === 0 ? (
        <p>You haven't rented any properties yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium">Property Name</th>
                <th className="py-2 px-4 text-left text-sm font-medium">Location</th>
                <th className="py-2 px-4 text-left text-sm font-medium">Price</th>
                <th className="py-2 px-4 text-left text-sm font-medium">Rented Date</th>
                <th className="py-2 px-4 text-left text-sm font-medium">Next Payment</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm">{rental.property.name}</td>
                  <td className="py-2 px-4 text-sm">{rental.property.location}</td>
                  <td className="py-2 px-4 text-sm">Ksh {formatPrice(rental.property.price)}</td>
                  <td className="py-2 px-4 text-sm">{format(new Date(rental.rented_at), 'PP')}</td>
                  <td className="py-2 px-4 text-sm">
                    <span className={`font-semibold ${calculateCountdown(rental.rented_at) === "Rent due" ? "text-red-500" : "text-green-500"}`}>
                      {calculateCountdown(rental.rented_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Rented;
