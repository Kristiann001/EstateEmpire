import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLock, FaUser, FaPhoneAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupSchema = z.object({
  email: z.string().email({ message: 'Join us with a valid email' }),
  password: z.string().min(8, { message: 'Secure passwords need 8+ characters' }),
  contact: z.string().min(10, { message: 'Enter a valid phone number' }),
  role: z.enum(['Agent', 'Client']),
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(result.message || 'Creation failed. Please try again.');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-40" />
      </div>

      <ToastContainer position="top-center" />
      
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-outfit mb-2">Join EstateEmpire</h2>
            <p className="text-gray-500">Create your account and find your perfect home.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                    placeholder="name@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Phone</label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('contact')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                    placeholder="07XX..."
                  />
                </div>
                {errors.contact && <p className="text-red-500 text-xs mt-2 ml-1">{errors.contact.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Password</label>
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
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Account Type</label>
              <div className="flex bg-gray-50 p-1 rounded-2xl">
                <label className="flex-1">
                  <input type="radio" {...register('role')} value="Client" className="hidden peer" defaultChecked />
                  <div className="py-3 text-center rounded-xl cursor-pointer transition-all peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-500 font-bold text-sm">
                    Client
                  </div>
                </label>
                <label className="flex-1">
                  <input type="radio" {...register('role')} value="Agent" className="hidden peer" />
                  <div className="py-3 text-center rounded-xl cursor-pointer transition-all peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-500 font-bold text-sm">
                    Agent
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-premium w-full py-4 text-base mt-2">
              Create account
            </button>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;