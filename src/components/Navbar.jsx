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
  const toggleHoldingsDropdown = () => {
    setIsHoldingsDropdownOpen(!isHoldingsDropdownOpen);
    setIsPropertyDropdownOpen(false);
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
    <nav className="bg-white p-4 shadow-lg">
  <div className="flex items-center justify-center">
    <div className="flex items-center space-x-10">
      <h1 className="text-4xl font-bold cursor-pointer text-blue-600">
        EstateEmpire
      </h1>
      <ul className="flex space-x-6">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link btn btn-primary' : 'nav-link btn')}>
            Home
          </NavLink>
        </li>
        <li className="relative">
          <div onClick={togglePropertyDropdown} className="nav-link cursor-pointer btn">
            Property
          </div>
          {isPropertyDropdownOpen && (
            <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg z-10">
              <li className="px-4 py-2 hover:bg-gray-200">
                <NavLink to="/rent" className="block text-gray-700" onClick={closeDropdowns}>
                  Rent
                </NavLink>
              </li>
              <li className="px-4 py-2 hover:bg-gray-200">
                <NavLink to="/buy" className="block text-gray-700" onClick={closeDropdowns}>
                  Buy
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li className="relative">
          <div onClick={toggleHoldingsDropdown} className="nav-link cursor-pointer btn">
            Holdings
          </div>
          {isHoldingsDropdownOpen && (
            <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg z-10">
              <li className="px-4 py-2 hover:bg-gray-200">
                <NavLink to="/rented" className="block text-gray-700" onClick={closeDropdowns}>
                  Rented
                </NavLink>
              </li>
              <li className="px-4 py-2 hover:bg-gray-200">
                <NavLink to="/purchased" className="block text-gray-700" onClick={closeDropdowns}>
                  Purchased
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="/agent"
            className={({ isActive }) => (isActive ? 'nav-link btn btn-primary' : 'nav-link btn')}
            onClick={closeDropdowns}
          >
            Agent
          </NavLink>
        </li>
      </ul>
      {!isLoggedIn ? (
        <NavLink
          to="/login"
          className="btn btn-primary"
        >
          Sign Up/
          Login
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
  </div>
</nav>



  );
}
