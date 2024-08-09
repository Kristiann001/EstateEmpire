import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Must contain at least one special character' }),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  accountType: z.enum(['Agent', 'Client'], { message: 'Please select an account type' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(SignupSchema)
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = (data) => {
    
    fetch('https://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          
          if (data.accountType === 'Agent') {
            window.location.href = '/agent';
          } else {
            window.location.href = '/';
          }
        } else {
          alert(data.message); 
        }
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to EstateEmpire</h2>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`mt-1 p-2 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`mt-1 p-2 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          <ul className="text-xs mt-2 text-gray-500">
            <li className={password.length >= 8 ? 'text-green-500' : 'text-red-500'}>At least 8 characters</li>
            <li className={/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}>At least one lowercase letter</li>
            <li className={/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}>At least one uppercase letter</li>
            <li className={/[0-9]/.test(password) ? 'text-green-500' : 'text-red-500'}>At least one number</li>
            <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-500' : 'text-red-500'}>At least one special character</li>
          </ul>
        </div>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`mt-1 p-2 block w-full rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          {confirmPassword && confirmPassword !== password && (
            <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
          )}
        </div>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">I am</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" value="Agent" {...register('accountType')} className="form-radio text-indigo-600" />
              <span className="ml-2">An agent</span>
            </label>
            <label className="flex items-center">
              <input type="radio" value="Client" {...register('accountType')} className="form-radio text-indigo-600" />
              <span className="ml-2">A client</span>
            </label>
          </div>
          {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType.message}</p>}
        </div>

        
        {password && confirmPassword && password === confirmPassword && !errors.accountType && (
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Create account
          </button>
        )}
      </form>
    </div>
  );
};

export default Signup;
