import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Buy() {
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/properties/for-sale')
            .then(response => {
                setPurchases(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the purchases!', error);
            });
    }, []);

    const filteredPurchases = purchases.filter(purchase =>
        purchase.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="flex justify-center pt-8 px-4 sm:px-6 lg:px-8">
                <input
                    type="text"
                    placeholder="Search for buyables..."
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs sm:max-w-sm lg:max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap justify-center pt-8 px-4 sm:px-6 lg:px-8">
                {filteredPurchases.map((purchase, index) => (
                    <Link 
                        to={`/purchase/${purchase.id}`} 
                        key={index} 
                        className="m-4 w-full sm:w-80 md:w-64 lg:w-72 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                        <img
                            className="rounded-t-lg w-full h-48 sm:h-56 md:h-64 object-cover"
                            src={purchase.image}
                            alt={purchase.name}
                        />
                        <div className="p-4">
                            <h5 className="mb-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {purchase.name}
                            </h5>
                            <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
                                {purchase.location}
                            </p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Ksh {purchase.price}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
