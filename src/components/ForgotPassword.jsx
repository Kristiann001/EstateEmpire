import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 animate-fade-in border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-outfit mb-2">Forgot Password?</h2>
          <p className="text-gray-500">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>}
          </div>

          <button type="submit" className="btn-premium w-full py-4 text-base">
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 font-bold hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
