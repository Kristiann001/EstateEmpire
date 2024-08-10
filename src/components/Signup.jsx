import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Must include at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter' })
    .regex(/\d/, { message: 'Must include at least one number' })
    .regex(/[@$!%*?&]/, { message: 'Must include at least one special character' }),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  accountType: z.enum(['Agent', 'Client'], { message: 'Please select an account type' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(SignupSchema)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const accountType = watch('accountType');
  const password = watch('password');

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
        if (data.accountType === 'Agent') {
          navigate('/agent'); 
        } else {
          navigate('/'); 
        }
      } else {
        const result = await response.json();
        console.error(result.message);
      }
    } catch (error) {
      console.error('Signup failed:', error.message);
    }
  };

  const checkPasswordRequirements = (password) => {
    const requirements = [
      { regex: /.{8,}/, message: 'At least 8 characters' },
      { regex: /[a-z]/, message: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, message: 'At least 1 uppercase letter' },
      { regex: /\d/, message: 'At least 1 number' },
      { regex: /[@$!%*?&]/, message: 'At least 1 special character (@$!%*?&)' },
    ];
    return requirements.map(requirement => ({
      ...requirement,
      satisfied: requirement.regex.test(password),
    }));
  };

  const passwordRequirements = checkPasswordRequirements(password);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="mb-4 text-center text-2xl font-bold">Welcome to EstateEmpire</h2>
          <div className="flex justify-center mb-4">
            <button type="button" className="mr-4 text-gray-600 border-b-2 border-blue-600">Sign Up</button>
            <button type="button" onClick={() => navigate('/login')} className="text-blue-600">Log In</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter Email"
            />
            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              onFocus={() => setShowRequirements(true)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Create Password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
          </div>
          {showRequirements && (
            <div className="mb-4">
              {passwordRequirements.map((req, index) => (
                <p key={index} className={`text-sm ${req.satisfied ? 'text-green-500' : 'text-red-500'}`}>
                  ✔️ {req.message}
                </p>
              ))}
            </div>
          )}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm Password"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">I am:</label>
            <div className="flex items-center">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  value="Agent"
                  {...register('accountType')}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">An Agent</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Client"
                  {...register('accountType')}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">A Client</span>
              </label>
            </div>
            {errors.accountType && <p className="text-red-500 text-xs italic mt-1">{errors.accountType.message}</p>}
          </div>
          {errors.submitError && <p className="text-red-500 text-xs italic mb-4">{errors.submitError.message}</p>}
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
