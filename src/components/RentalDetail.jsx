import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RentedDetail() {
    const { id } = useParams();
    const [rental, setRental] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://127.0.0.1:5000/properties/for-rent/${id}`, {

            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setRental(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the rental details!', error);
        });
    }, [id]);

    const handleRent = async () => {
        const phoneNumber = prompt("Please enter your phone number:");
        if (phoneNumber) {
            const token = localStorage.getItem('token');
            const payload = {
                property_id: parseInt(id),
                rent_amount: parseInt(rental.price),  
                phone_number: phoneNumber
            };
            console.log('Payload:', payload);
            
            try {
                const response = await axios.post('http://127.0.0.1:5000/rentals', payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Rent initiated successfully!');
                console.log(response.data);
            } catch (error) {
                console.error('Full error object:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    alert(`Rent initiation failed: ${error.response.data.message || 'Unknown error'}`);
                } else if (error.request) {
                    console.error('Request made but no response received:', error.request);
                    alert('No response received from server. Please try again later.');
                } else {
                    console.error('Error setting up request:', error.message);
                    alert('An error occurred while setting up the request.');
                }
            }
        }
    };

    if (!rental) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col p-10 space-y-4">
            <div className="flex space-x-4">
                <img 
                    className="object-cover w-1/2 rounded-lg" 
                    src={rental.image} 
                    alt={rental.name} 
                />

                <div className="flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800" style={{ width: 'calc(50% - 4px)' }}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{rental.name}</h3>
                    <p className="text-xl font-semibold">{rental.location}</p>
                    <p className="py-10 text-xl font-semibold">Ksh {rental.price}</p>
                    <button 
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
                        onClick={handleRent}
                    >
                        Rent
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow p-6 dark:border-gray-700 dark:bg-gray-800 w-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    {rental.description}
                </p>
            </div>

            <section className="location" style={{ width: '80%', margin: 'auto', padding: '80px 0' }}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.364476462935!2d36.79054473089192!3d-1.268124626700715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0xad2c84df1f7f2ec8!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1723993461840!5m2!1sen!2ske" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </section>
        </div>
    );
}



