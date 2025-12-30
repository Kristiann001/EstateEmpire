import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

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
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', result?.user?.role);
        setIsLoggedIn(true);
        setLoggedInEmail(data.email);
        toast.success(`Welcome back! Logged in as ${result.user.role}`);
        setTimeout(() => navigate('/'), 1500);
      } else {
        if (result.message === 'Please verify your email before logging in.') {
          navigate('/verify-email', { state: { email: data.email } });
        } else {
          toast.error(result.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <ToastContainer position="top-center" />
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-outfit mb-2">EstateEmpire</h2>
            <p className="text-gray-500">Welcome back! Please login to continue.</p>
          </div>

          {!isLoggedIn ? (
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

              <div className="flex items-center justify-between text-sm px-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="text-blue-600 font-semibold hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="btn-premium w-full py-4 text-base mt-2"
              >
                Log In
              </button>

              <p className="text-center text-gray-500 text-sm mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">✓</div>
              </div>
              <p className="text-lg">You are logged in as <br /><span className="font-bold text-gray-900">{loggedInEmail}</span></p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="btn-premium w-full"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-500 font-semibold hover:text-red-700 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;