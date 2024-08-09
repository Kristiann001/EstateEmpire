import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Rent() {
    const [rentals, setRentals] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/properties/for-rent')
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
            <div className="flex justify-center pt-8">
                <input
                    type="text"
                    placeholder="Search for rentals..."
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap justify-center pt-8 mx-44">
                {filteredRentals.map((rental, index) => (
                    <div key={index} className="ml-4 mb-4 w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <img
                                className="rounded-t-lg w-full h-64 object-cover"
                                src={rental.image}
                                alt={rental.name}
                            />
                        </a>
                        <div className="p-4">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {rental.name}
                            </h5>
                            <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
                                {rental.location}
                            </p>
                            <p className="font-semibold text-gray-700">Ksh {rental.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
