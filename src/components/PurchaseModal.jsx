import { useState } from 'react';
import { FaPhoneAlt, FaLock } from 'react-icons/fa';

function PurchaseModal({ isOpen, onClose, onSubmit }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(phoneNumber);
    setPhoneNumber('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="w-10 object-contain" />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 font-outfit">M-Pesa Payment</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Enter your M-Pesa registered phone number to receive an STK Push prompt on your phone.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 font-semibold tracking-widest placeholder:tracking-normal placeholder:font-normal"
                required
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
              <FaLock />
              <span>Secure encrypted payment</span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="btn-premium w-full py-4 text-base"
              >
                Pay Now
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-100 italic text-[10px] text-gray-400 text-center">
          Wait for the M-Pesa prompt on your phone after clicking Pay Now.
        </div>
      </div>
    </div>
  );
}

export default PurchaseModal;