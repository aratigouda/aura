import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-serif font-bold tracking-widest text-pink-600">
              AURASHINE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">Shop</Link>
            <Link to="/about" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">Contact</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <Search size={22} />
            </button>
            <Link to="/wishlist" className="text-gray-600 hover:text-pink-500 transition-colors relative">
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-pink-500 transition-colors relative">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/auth"} className="text-gray-600 hover:text-pink-500 transition-colors">
              <User size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-pink-100 p-4 shadow-lg"
          >
            <div className="max-w-3xl mx-auto flex items-center">
              <input 
                type="text" 
                placeholder="Search for dresses, sarees, tops..." 
                className="w-full border-none focus:ring-0 text-lg py-2"
                autoFocus
              />
              <button onClick={() => setIsSearchOpen(false)} className="ml-4 text-gray-400">
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 md:hidden bg-white pt-24 px-6"
          >
            <div className="flex flex-col space-y-6 text-xl">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium">Home</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium">Shop</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium">About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
