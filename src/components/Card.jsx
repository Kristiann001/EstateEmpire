export default function Card() {
    return (
        <div className="flex flex-col p-10 space-y-4">
            <div className="flex space-x-4">
                <img 
                    className="object-cover w-1/2 rounded-lg" 
                    src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" 
                    alt="Beautiful scenery" 
                />

                <div className="flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800" style={{ width: 'calc(50% - 4px)' }}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Serenity Hills</h3>
                    <p className="text-xl font-semibold">Downtown</p>
                    <p className="py-10 text-xl font-semibold">Ksh 500000</p>
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">
                        Purchase
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow p-6 dark:border-gray-700 dark:bg-gray-800 w-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Serenity Hills offers a tranquil and serene environment in the heart of Downtown. With breathtaking views and modern amenities, this property is perfect for those looking to escape the hustle and bustle while still being close to all the action.
                </p>
            </div>
        </div>
    )
}
