import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
      if (response.ok) {
        navigate('/login');
      } else {
        const result = await response.json();
        setError(result.message || 'Verification failed');
      }
    } catch (error) {
      setError('An error occurred during verification');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">Verify Your Email</h2>
        <p className="text-center mb-4">Please enter the OTP sent to {email}</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 border-gray-300"
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
  );
};

export default EmailVerification;