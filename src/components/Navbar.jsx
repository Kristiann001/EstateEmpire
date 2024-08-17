import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isHoldingsDropdownOpen, setIsHoldingsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      setIsLoggedIn(true);
      setLoggedInEmail(email);
    } else {
      setIsLoggedIn(false);
      setLoggedInEmail('');
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("User is logged in with email:", loggedInEmail);
    } else {
      console.log("User is logged out.");
    }
  }, [isLoggedIn, loggedInEmail]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    checkLoginStatus();
    closeDropdowns();
    navigate('/login');
  };

  const togglePropertyDropdown = () => {
    setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
    setIsHoldingsDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeDropdowns = () => {
    setIsPropertyDropdownOpen(false);
    setIsHoldingsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    closeDropdowns(); // Close dropdowns when opening mobile menu
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-4xl font-bold cursor-pointer text-amber-400">
          EstateEmpire
        </h1>
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-amber-400 focus:outline-none"
          >
            &#9776; {/* Hamburger icon */}
          </button>
        </div>
        <div className={`flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse ${isMobileMenuOpen ? 'block' : 'hidden'} md:flex`}>
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="text-amber-400 text-xl font-semibold text-center hover:text-white transition duration-300 ease-in-out"
            >
              Sign Up/Login
            </NavLink>
          ) : (
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${loggedInEmail}`} 
                alt="User Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleUserDropdown}
              />
              {isUserDropdownOpen && (
                <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <li className="px-4 py-2 text-gray-700">
                    Logged in as <strong>{loggedInEmail}</strong>
                  </li>
                  <li
                    className="px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Log Out
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        <div className={`w-full md:flex md:items-center md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row cursor-pointer mt-4 md:mt-0">
            <li className="text-xl">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li className="mt-4 md:mt-0 md:ml-20 text-xl relative">
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
            <li className="mt-4 md:mt-0 md:ml-20 text-xl">
              <NavLink
                to="/agent"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeDropdowns}
              >
                Agent
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
