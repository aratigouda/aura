import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Shield, LogOut, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <button onClick={() => navigate('/login')} className="text-emerald-600 font-bold">Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden"
      >
        <div className="bg-emerald-600 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <User size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name || 'User'}</h1>
              <p className="text-gray-500">{profile?.role?.toUpperCase() || 'USER'}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/orders')}
                className="flex items-center space-x-2 text-emerald-600 font-bold hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
              >
                <ShoppingBag size={18} />
                <span>Orders</span>
              </button>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</p>
                <p className="text-gray-900 font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Security</p>
                <p className="text-gray-900 font-medium">Verified Account</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
