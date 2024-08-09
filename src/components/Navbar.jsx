import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="text-white text-2xl">EstateEmpire</div>
      <div className="space-x-4">
        <Link to="/" className="text-white">Home</Link>
        <Link to="/properties" className="text-white">Properties</Link>
        <Link to="/Agent" className="text-white">Agent</Link>
        {isLoggedIn ? (
          <div className="relative">
            <button className="text-white">{user.email}</button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
              <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Log out</button>
            </div>
          </div>
        ) : (
          <button onClick={() => window.location.href = '/login'} className="text-white">Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
