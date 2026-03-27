import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Clock, 
  Truck, 
  CheckCircle,
  Mail,
  Calendar,
  Shield,
  LayoutDashboard,
  CreditCard,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'profile'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'order'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: any[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your dashboard</h1>
        <button onClick={() => navigate('/login')} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20">Login</button>
      </div>
    );
  }

  const totalSpent = orders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <ShoppingBag size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-3xl font-black text-gray-900">{orders.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
          <h3 className="text-3xl font-black text-gray-900">₹{totalSpent.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
            <Heart size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Wishlist Items</p>
          <h3 className="text-3xl font-black text-gray-900">{wishlistItems.length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <button onClick={() => setActiveTab('orders')} className="text-emerald-600 font-bold text-sm flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div 
                key={order.id} 
                onClick={() => navigate(`/order/${order.id}`)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Order #{order.orderId.slice(-6)}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {order.status}
                  </span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <div className="text-sm text-gray-500 font-medium">{orders.length} Orders Total</div>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')} className="mt-6 text-emerald-600 font-bold">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/order/${order.id}`)}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <img 
                      src={order.products[0]?.image} 
                      alt="product" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Order #{order.orderId}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.products.length} {order.products.length === 1 ? 'item' : 'items'} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-600">₹{Number(order.total).toFixed(2)}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'pending' ? 'text-amber-600' :
                      order.status === 'shipped' ? 'text-blue-600' :
                      'text-emerald-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <div className="text-sm text-gray-500 font-medium">{wishlistItems.length} Items Saved</div>
      </div>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
          <button onClick={() => navigate('/products')} className="mt-6 text-emerald-600 font-bold">Explore Products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => navigate(`/product/${item.id}`)}
              className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <div className="p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg">
                    <Heart size={18} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.name}</h4>
                <p className="text-emerald-600 font-black">₹{Number(item.price).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name: editName });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderProfile = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
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
              <p className="text-gray-500 font-medium uppercase tracking-widest text-xs mt-1">{profile?.role || 'USER'}</p>
            </div>
            <button 
              onClick={() => {
                setEditName(profile?.name || '');
                setIsEditingProfile(true);
              }}
              className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Settings size={16} />
              <span>Edit Profile</span>
            </button>
          </div>

          {isEditingProfile ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleUpdateProfile} 
              className="space-y-6 bg-gray-50 p-6 rounded-3xl mb-8"
            >
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="bg-white text-gray-600 px-6 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                <p className="text-gray-900 font-bold text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
                <p className="text-gray-900 font-bold text-sm">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Security</p>
                <p className="text-gray-900 font-bold text-sm">Verified Account</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Default Address</p>
                <p className="text-gray-900 font-bold text-sm">Not set</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-72 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 font-black text-2xl">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 text-red-500 font-bold hover:bg-red-50 py-3 rounded-2xl transition-all"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          <nav className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <ShoppingBag size={20} />
              <span>My Orders</span>
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'wishlist' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Heart size={20} />
              <span>Wishlist</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'wishlist' && renderWishlist()}
              {activeTab === 'profile' && renderProfile()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
