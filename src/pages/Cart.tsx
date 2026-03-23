import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-8">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collection to find something you love.</p>
        <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold transition-all inline-flex items-center space-x-2 group">
          <span>Start Shopping</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
        <span className="text-gray-500 font-medium">{cart.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <motion.div 
              key={item.cartItemId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-emerald-600 font-bold mb-4">₹{Number(item.price).toFixed(2)}</p>
                
                <div className="flex items-center justify-center sm:justify-start space-x-4">
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-xl font-extrabold text-gray-900">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
          
          <Link to="/products" className="inline-flex items-center space-x-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors group py-4">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-[2.5rem] p-10 space-y-8 sticky top-24 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{Number(total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-extrabold text-emerald-600">₹{Number(total).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/payment')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-emerald-600/20 group"
            >
              <span>Checkout</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-xs text-gray-400 font-medium">
              Tax included. Shipping calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
