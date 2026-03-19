import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const BottomNav: React.FC = () => {
  const { wishlistCount } = useWishlist();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <Home size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </NavLink>

        <NavLink 
          to="/products" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <Grid size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Shop</span>
        </NavLink>

        <NavLink 
          to="/wishlist" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors relative ${
              isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
        </NavLink>

        <NavLink 
          to="/orders" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <User size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
