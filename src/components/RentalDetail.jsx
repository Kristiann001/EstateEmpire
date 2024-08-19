import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PurchaseModal from './PurchaseModal';
import formatPrice from './utilis';
import toast from 'react-hot-toast';

export default function RentedDetail() {
    const { id } = useParams();
    const [rental, setRental] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`https://estateempire-backend.onrender.com/properties/for-rent/${id}`, {
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

    const handleRental = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (phoneNumber) => {
        setIsModalOpen(false);
        const token = localStorage.getItem('token');
        const payload = {
            property_id: parseInt(id),
            amount: parseInt(rental.price),
            phone_number: phoneNumber
        };
        console.log('Payload:', payload);

        try {
            const response = await axios.post('https://estateempire-backend.onrender.com/rentals', payload, {

                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Rent payment initiated successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Full error object:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                toast.error(`Rent payment initiation failed: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error('Request made but no response received:', error.request);
                toast.error('No response received from server. Please try again later.');
            } else {
                console.error('Error setting up request:', error.message);
                toast.error('An error occurred while setting up the request.');
            }
        }
    };

    if (!rental) {
        return <div className="text-center mt-8 text-gray-700">Loading...</div>;
    }

    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://assets-news.housing.com/news/wp-content/uploads/2021/10/28230258/Best-colours-for-home-outside-shutterstock_346448522.jpg')" }}>
            <div className="flex flex-col p-4 sm:p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                    <img
                        className="object-cover w-full md:w-1/2 rounded-lg shadow-lg"
                        src={rental.image}
                        alt={rental.name}
                    />

                    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800 w-full md:w-1/2 p-6">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{rental.name}</h3>
                        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{rental.location}</p>
                        <p className="py-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Ksh {formatPrice(rental.price)}</p>
                        <button
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                            onClick={handleRental}
                        >
                            Rent
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        {rental.description}
                    </p>
                </div>

                <PurchaseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />

                <section className="w-full mx-auto py-8">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.364476462935!2d36.79054473089192!3d-1.268124626700715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0xad2c84df1f7f2ec8!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1723993461840!5m2!1sen!2ske"
                        className="w-full h-64 md:h-96 rounded-lg shadow-lg"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </section>
            </div>
        </div>
    );
}
