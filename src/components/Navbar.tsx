import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Home as HomeIcon, ShoppingBag, Heart, ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="p-2 mr-2 text-gray-600 hover:text-emerald-600 transition-colors sm:hidden"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  LUXE<span className="text-emerald-600">SHOP</span>
                </span>
              </Link>
            </div>

            <div className="hidden sm:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Home</Link>
              <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Shop</Link>
            </div>

            <div className="flex items-center space-x-4">
              <div 
                onClick={() => navigate("/wishlist")} 
                className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>

              {cart.length > 0 && (
                <button 
                  onClick={() => navigate("/cart")}
                  className="hidden md:flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/10 group"
                >
                  <span>View Cart</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {user ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigate("/orders")} 
                    className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    title="My Orders"
                  >
                    <ShoppingBag size={22} />
                  </button>
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                      <LayoutDashboard size={22} />
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <Link to="/profile" className="text-sm font-medium text-gray-700 hidden md:block hover:text-emerald-600 transition-colors">
                      {profile?.name}
                    </Link>
                    <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                      <LogOut size={22} />
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-1 p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                  <User size={22} />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  LUXE<span className="text-emerald-600">SHOP</span>
                </span>
                <button 
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <Link 
                  to="/" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold"
                >
                  <HomeIcon size={22} />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/products" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold"
                >
                  <ShoppingBag size={22} />
                  <span>Shop</span>
                </Link>
                <Link 
                  to="/wishlist" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold"
                >
                  <Heart size={22} />
                  <span>Wishlist</span>
                </Link>
                <Link 
                  to="/orders" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold"
                >
                  <ShoppingBag size={22} />
                  <span>Orders</span>
                </Link>
                <Link 
                  to="/profile" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold"
                >
                  <User size={22} />
                  <span>Profile</span>
                </Link>

                {cart.length > 0 && (
                  <button 
                    onClick={() => {
                      navigate("/cart");
                      toggleSidebar();
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-900 text-white font-bold shadow-xl shadow-gray-900/20 group mt-4"
                  >
                    <div className="flex items-center space-x-4">
                      <ShoppingCart size={22} />
                      <span>View Cart</span>
                    </div>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {user && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-6 px-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{profile?.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
                  >
                    <LogOut size={22} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
