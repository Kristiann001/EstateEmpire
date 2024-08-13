import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

// Zod schema for validation
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must have at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must have at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must have at least one number' })
    .regex(/[!@#$%&*_]/, { message: 'Password must have at least one special character' }),
  contact: z.string()
    .length(10, { message: 'Contact number must be 10 digits' })
    .regex(/^[0-9]+$/, { message: 'Contact number must contain only numbers' }),
  role: z.enum(['Agent', 'Client'], { message: 'You must select an account type' }),
});

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const password = watch('password');
  const email = watch('email');
  const contact = watch('contact');
  const role = watch('role');

  useEffect(() => {
    setIsFormValid(
      email && password && contact && role &&
      !errors.email && !errors.password && !errors.contact && !errors.role
    );
  }, [email, password, contact, role, errors]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Show success message and navigate to login
        alert('Account successfully created. You can now log in.');
        navigate('/login');
      } else {
        // Handle server errors
        const result = await response.json();
        setErrorMessage(result.message || 'Failed to create account');
      }
    } catch (error) {
      // Handle fetch error
      setErrorMessage('An error occurred while creating the account.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Welcome to EstateEmpire</h2>
      <div className="flex justify-center mb-6">
        <button className="mr-2 text-blue-600 border-b-2 border-blue-600">Sign Up</button>
        <button className="text-gray-600" onClick={() => navigate('/login')}>Log In</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full p-2 mt-1 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4 relative">
          <label htmlFor="password" className="block font-semibold">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className={`w-full p-2 mt-1 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600">
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {password && (
            <ul className="text-sm mt-2">
              <li className={`${password.length >= 8 ? 'text-green-500' : 'text-red-500'}`}>At least 8 characters</li>
              <li className={`${/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one uppercase letter</li>
              <li className={`${/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one lowercase letter</li>
              <li className={`${/[0-9]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one number</li>
              <li className={`${/[!@#$%&*_]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one special character</li>
            </ul>
          )}
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="contact" className="block font-semibold">Contact Number</label>
          <input
            id="contact"
            type="text"
            {...register('contact')}
            className={`w-full p-2 mt-1 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block font-semibold">I am</label>
          <select
            id="role"
            {...register('role')}
            className={`w-full p-2 mt-1 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          >
            <option value="">Select your account type</option>
            <option value="Agent">Agent</option>
            <option value="Client">Client</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
        </div>

        {isFormValid && (
          <div className="mt-6">
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-md"
            >
              Create account
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
