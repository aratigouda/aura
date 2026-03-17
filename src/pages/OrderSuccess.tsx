import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ShoppingBag, ArrowRight, Home } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-pink-50 shadow-xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500"
        >
          <CheckCircle size={48} />
        </motion.div>

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Thank you for shopping with Aurashine. Your order has been placed successfully and is being processed.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/shop')}
            className="w-full bg-pink-600 text-white py-4 rounded-full font-bold hover:bg-pink-700 transition-all flex items-center justify-center shadow-lg shadow-pink-200 group"
          >
            Continue Shopping <ShoppingBag size={20} className="ml-2" />
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-white text-gray-600 py-4 rounded-full font-bold border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group"
          >
            <Home size={20} className="mr-2" /> Back to Home
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-pink-50 flex items-center justify-center space-x-2 text-sm text-gray-400">
          <p>A confirmation email has been sent to your inbox.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
