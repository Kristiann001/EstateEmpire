import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://estateempire-backend.onrender.com/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Delay navigation to ensure toast is visible
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Email verification failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during email verification: ' + error.message);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://assets-news.housing.com/news/wp-content/uploads/2021/10/28230258/Best-colours-for-home-outside-shutterstock_346448522.jpg')" }}
    >
      <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-opacity-10">
        <ToastContainer />
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">Verify Your Email</h2>
          <p className="text-center mb-4">Please enter the OTP sent to {email}</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-200 text-black border rounded-full focus:outline-none"
                placeholder="Enter OTP"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Verify Email
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default EmailVerification;

