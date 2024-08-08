import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-12">
      <div className="flex flex-wrap items-center justify-between ">
        <h1 className="text-4xl font-bold cursor-pointer text-black">
            EstateEmpire
        </h1>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-black text-xl bg-amber-500 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg font-semibold px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={goToLoginPage}
          >
            Login
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
          </button>
        </div>
        <div>
          <ul className="flex cursor-pointer">
            <li className="text-xl">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            </li>
            <li className="ml-20 text-xl">
              <NavLink to="/rent" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Property</NavLink>
            </li>
            <li className='ml-20 text-xl'>
            <NavLink to="/agent" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Agent</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
