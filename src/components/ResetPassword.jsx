import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
        toast.error('Invalid or missing token');
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully! Please login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 animate-fade-in border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-outfit mb-2">Reset Password</h2>
          <p className="text-gray-500">Create a new secure password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                placeholder="••••••••"
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="btn-premium w-full py-4 text-base">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
