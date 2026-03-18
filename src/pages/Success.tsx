import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

const Success: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-12 text-center border border-gray-100"
      >
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-10">
          <CheckCircle size={56} />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 mb-12 leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully and is now being processed. We've sent a confirmation email to your inbox.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-emerald-600/20 group"
          >
            <span>Back to Home</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/products" 
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 group"
          >
            <ShoppingBag size={22} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
