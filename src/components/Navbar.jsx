import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isHoldingsDropdownOpen, setIsHoldingsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const navigate = useNavigate();

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
  }, []);

  const handleLogin = () => {
    const token = 'dummy-token';
    const email = 'user@example.com';
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    checkLoginStatus();
    navigate('/'); // Navigate to the home page after login
  };

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

  return (
    <nav className="bg-blue-600 p-12">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-4xl font-bold cursor-pointer text-amber-400">
          EstateEmpire
        </h1>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="text-amber-400 text-xl font-semibold text-center hover:text-white transition duration-300 ease-in-out"
              onClick={handleLogin} // Simulate login for demonstration
            >
              Sign Up/Login
            </NavLink>
          ) : (
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${loggedInEmail}`} // Placeholder image using logged in email
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
          </ul>
        </div>
      </div>
    </nav>
  );
}
