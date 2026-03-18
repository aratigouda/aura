import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
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
          <span className="text-[10px] font-bold uppercase tracking-wider">Categories</span>
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
