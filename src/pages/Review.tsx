import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const Review: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Review Order</h1>
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-emerald-600 font-bold flex items-center space-x-2 transition-colors">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8"
        >
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
              <p className="text-emerald-600 font-extrabold text-xl">₹{product.price}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 font-medium">
                <span className="px-3 py-1 bg-gray-100 rounded-full">Size: {product.selectedSize || product.size || 'Free Size'}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">Qty: 1</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between text-gray-500 font-medium">
              <span>Item Total</span>
              <span>₹{product.price}</span>
            </div>
            <div className="flex items-center justify-between text-gray-500 font-medium">
              <span>Shipping</span>
              <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
            </div>
            {product.easyReturn && (
              <div className="flex items-center justify-between text-gray-500 font-medium">
                <span>Easy Return Protection</span>
                <span className="text-emerald-600 font-bold uppercase text-xs">Included</span>
              </div>
            )}
            <div className="pt-4 flex justify-between items-end border-t border-gray-100">
              <span className="text-lg font-bold text-gray-900">Order Total</span>
              <span className="text-3xl font-extrabold text-emerald-600">₹{product.price}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate("/payment", { state: { product } })}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-3 group"
          >
            <span>Continue</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Why Buy From Us?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-sm"><Truck size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-900">Fast & Free Delivery</h4>
                  <p className="text-sm text-gray-500">Get your items delivered within 3-5 business days at no extra cost.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-sm"><ShieldCheck size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-900">Secure Payments</h4>
                  <p className="text-sm text-gray-500">Your transactions are protected with industry-standard encryption.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-sm"><RefreshCw size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-500">Not satisfied? Return your product within 30 days for a full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
