import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PhoneNumberPrompt({ onSubmit }) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = () => {
        onSubmit(phoneNumber);
        toast.dismiss();
    };

    return (
        <div>
            <p>Please enter your phone number:</p>
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button
                onClick={handleSubmit}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Submit
            </button>
        </div>
    );
}

export default function RentedDetail() {
    const { id } = useParams();
    const [rental, setRental] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`https://estateempire-backend.onrender.com/properties/for-rent/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            setRental(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the rental details!', error);
        });
    }, [id]);

    const handleRent = () => {
        toast(
            <PhoneNumberPrompt onSubmit={handlePhoneNumberSubmit} />,
            { autoClose: false, closeOnClick: false }
        );
    };

    const handlePhoneNumberSubmit = async (phoneNumber) => {
        if (phoneNumber) {
            const token = localStorage.getItem('token');
            const payload = {
                property_id: parseInt(id),
                rent_amount: parseInt(rental.price),
                phone_number: phoneNumber,
            };
            console.log('Payload:', payload);

            try {
                const response = await axios.post('https://estateempire-backend.onrender.com/rentals', payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                toast.success('Rent initiated successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.log(response.data);
            } catch (error) {
                console.error('Full error object:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    toast.error(`Rent initiation failed: ${error.response.data.message || 'Unknown error'}`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } else if (error.request) {
                    console.error('Request made but no response received:', error.request);
                    toast.error('No response received from server. Please try again later.', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } else {
                    console.error('Error setting up request:', error.message);
                    toast.error('An error occurred while setting up the request.', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
        }
    };

    if (!rental) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 space-y-4">
            <ToastContainer />
            <div className="flex flex-col sm:flex-row sm:space-x-4">
                <img
                    className="object-cover w-full sm:w-1/2 rounded-lg mb-4 sm:mb-0"
                    src={rental.image}
                    alt={rental.name}
                />

                <div className="flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800 sm:w-1/2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{rental.name}</h3>
                    <p className="text-lg sm:text-xl font-semibold">{rental.location}</p>
                    <p className="py-4 sm:py-6 text-lg sm:text-xl font-semibold">Ksh {rental.price}</p>
                    <button
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
                        onClick={handleRent}
                    >
                        Rent
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow p-4 sm:p-6 lg:p-8 dark:border-gray-700 dark:bg-gray-800 w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                    {rental.description}
                </p>
            </div>
        </div>
    );
}
