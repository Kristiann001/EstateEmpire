import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isHoldingsDropdownOpen, setIsHoldingsDropdownOpen] = useState(false);

  const togglePropertyDropdown = () => {
    setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
    setIsHoldingsDropdownOpen(false); // Close Holdings dropdown when Property is toggled
  };

  const toggleHoldingsDropdown = () => {
    setIsHoldingsDropdownOpen(!isHoldingsDropdownOpen);
    setIsPropertyDropdownOpen(false); // Close Property dropdown when Holdings is toggled
  };

  const closeDropdowns = () => {
    setIsPropertyDropdownOpen(false);
    setIsHoldingsDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 p-12">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-4xl font-bold cursor-pointer text-amber-400">
          EstateEmpire
        </h1>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavLink
            to="/login"
            className="text-amber-400 text-xl font-semibold text-center hover:text-white transition duration-300 ease-in-out"
          >
            Sign Up/Login
          </NavLink>
        </div>
        <div>
          <ul className="flex cursor-pointer">
            <li className="text-xl">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li className="ml-20 text-xl relative">
              <div onClick={togglePropertyDropdown} className="nav-link cursor-pointer">
                Property
              </div>
              {isPropertyDropdownOpen && (
                <ul className="absolute left-0 top-full mt-2 bg-amber-400 shadow-lg rounded-lg z-10">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <NavLink to="/rent" className="block text-gray-700" onClick={closeDropdowns}>
                      Rent
                    </NavLink>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <NavLink to="/buy" className="block text-gray-700" onClick={closeDropdowns}>
                      Buy
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="ml-20 text-xl relative">
              <div onClick={toggleHoldingsDropdown} className="nav-link cursor-pointer">
                Holdings
              </div>
              {isHoldingsDropdownOpen && (
                <ul className="absolute left-0 top-full mt-2 bg-amber-400 shadow-lg rounded-lg z-10">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <NavLink to="/rented" className="block text-gray-700" onClick={closeDropdowns}>
                      Rented
                    </NavLink>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <NavLink to="/purchased" className="block text-gray-700" onClick={closeDropdowns}>
                      Purchased
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="ml-20 text-xl">
              <NavLink to="/agent" className="block text-gray-700" onClick={closeDropdowns}>
                Agent
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
