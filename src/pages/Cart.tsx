import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-50 rounded-full text-pink-300 mb-4">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our collection and find something you love!
        </p>
        <Link to="/shop" className="inline-block bg-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-700 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    // In a real app, this would navigate to a checkout page
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Your Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center bg-white p-6 rounded-3xl border border-pink-50 shadow-sm"
              >
                <div className="w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-pink-50">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="ml-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Size: <span className="text-pink-500 font-medium">{item.selectedSize}</span> | 
                        Color: <span className="text-pink-500 font-medium">{item.selectedColor}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center border border-pink-100 rounded-full px-3 py-1 bg-pink-50/50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-pink-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-bold text-gray-800 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-pink-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-bold text-pink-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] border border-pink-50 shadow-sm sticky top-32">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-500 font-medium">FREE</span>
              </div>
              <div className="pt-4 border-t border-pink-100 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-pink-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-pink-600 text-white py-4 rounded-full font-bold hover:bg-pink-700 transition-all flex items-center justify-center shadow-lg shadow-pink-200 group"
            >
              Checkout Now <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-gray-400 mt-6">
              Secure checkout powered by Stripe. All taxes included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
