import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaShieldAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    contact: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        contact: response.data.contact,
        email: response.data.email
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('http://localhost:5000/user', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsEditing(false);
      localStorage.setItem('email', formData.email); // Update local storage if email changed
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-white">
          {/* Header Overlay */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.email}&background=2563eb&color=fff&size=128&bold=true`}
                  className="w-full h-full rounded-[1.25rem] object-cover"
                  alt="Profile"
                />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 px-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-outfit">{user.role} Account</h1>
                <p className="text-gray-500">Manage your account settings and contact info</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-600 hover:text-white transition-all"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                   <button
                    onClick={() => setIsEditing(false)}
                    className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-none transition-all font-medium ${
                          isEditing ? 'bg-gray-50 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Contact Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-none transition-all font-medium ${
                          isEditing ? 'bg-gray-50 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-500'
                        }`}
                        placeholder="07XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 space-y-6">
                  <h3 className="font-bold text-gray-900 font-outfit">Account Insights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                        <FaShieldAlt />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Account Status</p>
                        <p className="text-sm font-bold text-green-600">Verified & Secure</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                        <FaCalendarAlt />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Member Since</p>
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="btn-premium w-full py-4 flex items-center justify-center gap-2"
                >
                  <FaSave />
                  Save Changes
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
