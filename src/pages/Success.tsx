import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

const Success: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-12 text-center border border-gray-100"
      >
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-10">
          <CheckCircle size={56} />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully and is now being processed.
        </p>

        {order && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {order.products.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">₹{Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">Total Paid</span>
              <span className="text-lg font-extrabold text-emerald-600">₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        )}
        
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
