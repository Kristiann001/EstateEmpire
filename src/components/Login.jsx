import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Check if user is already logged in by checking the existence of a token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token); // Save the token to localStorage
        setIsLoggedIn(true); // Update the state to reflect that the user is logged in
        // Navigate to the respective user page after login
        navigate('/');
      } else {
        const result = await response.json();
        console.error(result.message);
      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    setIsLoggedIn(false); // Update the state to reflect that the user is logged out
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-center text-2xl font-bold mb-6">Login to EstateEmpire</h2>
        <div className="flex justify-center mb-4">
          {!isLoggedIn ? (
            <>
              <button type="button" onClick={() => navigate('/signup')} className="text-gray-600">Sign Up</button>
              <button type="button" className="ml-4 text-blue-600 border-b-2 border-blue-600">Log In</button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-600 border-b-2 border-red-600"
            >
              Log Out
            </button>
          )}
        </div>

        {!isLoggedIn ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter Email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter Password"
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
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Log In
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p>You are already logged in.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
