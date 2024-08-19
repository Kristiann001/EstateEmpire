import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); 
    if (token && email) {
      setIsLoggedIn(true);
      setLoggedInEmail(email);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://estateempire-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.access_token); 
        localStorage.setItem('email', data.email); 
        localStorage.setItem('role', result.user.role);
        setIsLoggedIn(true); 
        setLoggedInEmail(data.email); 
        
        // Show success toast with role information
        toast.success(`Logged in successfully as ${result.user.role}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        // Navigate to the home page after showing the toast
        setTimeout(() => {
          navigate('/');
        }, 700); // Adjust the delay if needed to ensure the toast is visible
      } else {
        const result = await response.json();
        toast.error(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('email'); 
    setIsLoggedIn(false); 
    setLoggedInEmail(''); 
    navigate('/login'); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://assets-news.housing.com/news/wp-content/uploads/2021/10/28230258/Best-colours-for-home-outside-shutterstock_346448522.jpg')"}}>
      <ToastContainer />
      <div className="w-full max-w-md border-2 border-blue-400 rounded-lg p-8 bg-white bg-opacity-80 mx-4 sm:mx-8 md:mx-auto">
        <h2 className="text-center text-lg sm:text-xl font-bold text-black mb-4">Welcome to EstateEmpire</h2>

        <div className="flex flex-col sm:flex-row justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="px-4 py-2 border border-blue-400 text-blue-600 rounded-full focus:outline-none"
          >
            Sign Up
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-full focus:outline-none"
          >
            Log In
          </button>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        {!isLoggedIn ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-black">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`mt-1 w-full px-4 py-2 bg-gray-200 text-black border rounded-full focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter Email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm sm:text-base font-medium text-black">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`mt-1 w-full px-4 py-2 bg-gray-200 text-black border rounded-full focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Create Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Log In
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p>You are logged in as <strong>{loggedInEmail}</strong>.</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 text-red-600 border-b-2 border-red-600"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
