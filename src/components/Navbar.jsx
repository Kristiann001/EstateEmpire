import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChartLine, FaKey, FaHome, FaLayerGroup, FaHistory, 
  FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes 
} from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isHoldingsDropdownOpen, setIsHoldingsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (token && email) {
      setIsLoggedIn(true);
      setLoggedInEmail(email);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setLoggedInEmail('');
      setUserRole('');
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    checkLoginStatus();
    closeDropdowns();
    navigate('/login');
  };

  const closeDropdowns = () => {
    setIsPropertyDropdownOpen(false);
    setIsHoldingsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="navbar-container fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <h1 
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer font-outfit"
            >
              EstateEmpire
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `nav-link-modern ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            
            {/* Property Dropdown */}
            <div className="relative group">
              <button 
                onMouseEnter={() => setIsPropertyDropdownOpen(true)}
                className="nav-link-modern flex items-center gap-1.5 transition-colors"
                onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
              >
                Property
                <FaChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isPropertyDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsPropertyDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-56 glass-card rounded-3xl py-3 z-50 animate-fade-in shadow-2xl border border-white/40"
                >
                  <NavLink to="/rent" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={closeDropdowns}>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FaKey /></div>
                    <div className="flex flex-col">
                      <span className="font-bold">Rent</span>
                      <span className="text-[10px] text-gray-400">Discover rentals</span>
                    </div>
                  </NavLink>
                  <NavLink to="/buy" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={closeDropdowns}>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><FaHome /></div>
                    <div className="flex flex-col">
                      <span className="font-bold">Buy</span>
                      <span className="text-[10px] text-gray-400">Own your home</span>
                    </div>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Holdings Dropdown */}
            <div className="relative group">
              <button 
                onMouseEnter={() => setIsHoldingsDropdownOpen(true)}
                className="nav-link-modern flex items-center gap-1.5 transition-colors"
                onClick={() => setIsHoldingsDropdownOpen(!isHoldingsDropdownOpen)}
              >
                Holdings
                <FaChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isHoldingsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isHoldingsDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsHoldingsDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-56 glass-card rounded-3xl py-3 z-50 animate-fade-in shadow-2xl border border-white/40"
                >
                  <NavLink to="/rented" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={closeDropdowns}>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FaLayerGroup /></div>
                     <div className="flex flex-col">
                      <span className="font-bold">Rented</span>
                      <span className="text-[10px] text-gray-400">Active leases</span>
                    </div>
                  </NavLink>
                  <NavLink to="/purchased" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={closeDropdowns}>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><FaHistory /></div>
                    <div className="flex flex-col">
                      <span className="font-bold">Purchased</span>
                      <span className="text-[10px] text-gray-400">Asset history</span>
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <NavLink to="/login" className="btn-premium py-2.5 px-6 text-sm">
                Get Started
              </NavLink>
            ) : (
              <div className="flex items-center gap-4">
                {/* Agent Dashboard Icon */}
                {userRole === 'Agent' && (
                  <button 
                    onClick={() => navigate('/agent')}
                    className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-200"
                    title="Agent Dashboard"
                  >
                    <FaChartLine className="text-lg" />
                  </button>
                )}

                <div className="relative">
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${loggedInEmail}&background=2563eb&color=fff&bold=true`} 
                      alt="User Profile"
                      className="w-10 h-10 rounded-2xl border-2 border-white shadow-md shadow-blue-100"
                    />
                  </button>
                  {isUserDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-3 w-64 glass-card rounded-[2rem] py-4 z-50 animate-fade-in shadow-2xl border border-white/50"
                    >
                      <div className="px-6 py-3 border-b border-gray-100 mb-2">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{userRole}</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{loggedInEmail}</p>
                      </div>
                      <NavLink 
                        to="/profile" 
                        className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={closeDropdowns}
                      >
                        <FaUser className="text-gray-400" />
                        My Profile
                      </NavLink>
                      <button
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-3 bg-gray-50 text-gray-600 rounded-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-card mx-4 rounded-3xl p-6 shadow-2xl border border-white/50 animate-fade-in">
          <div className="flex flex-col gap-4">
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 rounded-2xl">Home</NavLink>
            <NavLink to="/rent" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 rounded-2xl">Rent</NavLink>
            <NavLink to="/buy" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 rounded-2xl">Buy</NavLink>
            {isLoggedIn && userRole === 'Agent' && (
              <NavLink to="/agent" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-bold text-blue-600 bg-blue-50 rounded-2xl">Agent Dashboard</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
