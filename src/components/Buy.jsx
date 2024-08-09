import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Buy() {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/properties/for-sale')
            .then(response => {
                setPurchases(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the purchases!', error);
            });
    }, []);

    return (
        <>
        <div className="flex flex-wrap justify-center pt-32 mx-44">
            {purchases.map((purchase, index) => (
            <div key={index} className="ml-4 mb-4 w-64 h-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={purchase.image}
                    alt={purchase.name}
                />
                </a>
                <div className="p-4">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {purchase.name}
                </h5>
                <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
                    {purchase.location}
                </p>
                <p className="font-semibold text-gray-700">Ksh {purchase.price}</p>
                </div>
            </div>
            ))}
        </div>
        </>
    );
}

