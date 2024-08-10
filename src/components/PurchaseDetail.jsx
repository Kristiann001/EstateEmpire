import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PurchaseDetail() {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/properties/for-sale/${id}`)
            .then(response => {
                setPurchase(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the purchase details!', error);
            });
    }, [id]);

    if (!purchase) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col p-10 space-y-4">
            <div className="flex space-x-4">
                <img 
                    className="object-cover w-1/2 rounded-lg" 
                    src={purchase.image} 
                    alt={purchase.name} 
                />

                <div className="flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800" style={{ width: 'calc(50% - 4px)' }}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{purchase.name}</h3>
                    <p className="text-xl font-semibold">{purchase.location}</p>
                    <p className="py-10 text-xl font-semibold">Ksh {purchase.price}</p>
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">
                        Buy
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow p-6 dark:border-gray-700 dark:bg-gray-800 w-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    {purchase.description}
                </p>
            </div>
        </div>
    );
}
