import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import formatPrice from './utilis';

export default function Rent() {
    const [rentals, setRentals] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('https://estateempire-backend.onrender.com/properties/for-rent')
            .then(response => {
                setRentals(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the rentals!', error);
            });
    }, []);

    const filteredRentals = rentals.filter(rental =>
        rental.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="flex justify-center pt-8 px-4 sm:px-6 lg:px-8 bg-gray-200">
                <input
                    type="text"
                    placeholder="Search for rentals..."
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs sm:max-w-sm lg:max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap justify-center pt-8 px-4 sm:px-6 lg:px-8 bg-gray-200">
                {filteredRentals.map((rental, index) => (
                    <Link 
                        to={`/rental/${rental.id}`} 
                        key={index} 
                        className="m-4 w-full sm:w-80 md:w-64 lg:w-72 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                        <img
                            className="rounded-t-lg w-full h-48 sm:h-56 md:h-64 object-cover"
                            src={rental.image}
                            alt={rental.name}
                        />
                        <div className="p-4">
                            <h5 className="mb-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {rental.name}
                            </h5>
                            <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
                                {rental.location}
                            </p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Ksh {formatPrice(rental.price)}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
