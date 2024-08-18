import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Zod schema for validation
const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%&*_]/, { message: 'Password must contain at least one special character' }),
  contact: z.string()
    .length(10, { message: 'Contact number must be exactly 10 digits' })
    .regex(/^[0-9]+$/, { message: 'Contact number must contain only numbers' }),
  role: z.enum(['Agent', 'Client'], { message: 'Please select an account type' }),
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
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        const result = await response.json();
        setErrorMessage(result.message || 'Failed to create account');
        toast.error(result.message || 'Failed to create account'); 
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the account.');
      toast.error('An error occurred while creating the account.');
    }
  };
  

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://assets-news.housing.com/news/wp-content/uploads/2021/10/28230258/Best-colours-for-home-outside-shutterstock_346448522.jpg')" }}>
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 sm:mb-6 text-gray-900">Create Your EstateEmpire Account</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4 sm:mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full focus:outline-none">Sign Up</button>
            <button className="px-4 py-2 border border-blue-400 text-blue-600 rounded-full focus:outline-none" onClick={() => navigate('/login')}>Log In</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {errorMessage && <p className="text-red-500 text-xs sm:text-sm mb-4">{errorMessage}</p>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`mt-1 block w-full px-3 py-2 bg-gray-200 text-black border rounded-full focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className={`mt-1 block w-full px-3 py-2 bg-gray-200 text-black border rounded-full focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              {password && (
                <ul className="text-xs sm:text-sm mt-2">
                  <li className={`${password.length >= 8 ? 'text-green-500' : 'text-red-500'}`}>At least 8 characters</li>
                  <li className={`${/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one uppercase letter</li>
                  <li className={`${/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one lowercase letter</li>
                  <li className={`${/[0-9]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one number</li>
                  <li className={`${/[!@#$%&*_]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>At least one special character</li>
                </ul>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                id="contact"
                type="text"
                {...register('contact')}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0123456789"
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am</label>
              <select
                id="role"
                {...register('role')}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select your account type</option>
                <option value="Agent">Agent</option>
                <option value="Client">Client</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            <div className="mt-4 sm:mt-6">
              <button
                type="submit"
                className={`w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isFormValid ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isFormValid}
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
