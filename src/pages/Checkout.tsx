import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CreditCard, Truck, MapPin, Phone, Mail, User, ArrowRight, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for Google Apps Script
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        totalAmount: totalPrice,
        products: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor
        }))
      };

      // Send to Google Apps Script
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwL5SzUNcnVzZvSHaOy_4Po1WhkWTc5Rj_HVWJ49ZScHBUTQgmwtGcbsuGKtI-n38Kp/exec';
      
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });
      } catch (err) {
        console.warn('Google Script submission warning:', err);
      }

      // Create order in Firestore
      const orderData = {
        userId: user?.uid || 'guest',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor
        })),
        total: totalPrice,
        status: 'pending',
        shippingAddress: formData,
        createdAt: serverTimestamp()
      };

      try {
        await addDoc(collection(db, 'orders'), orderData);
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          const errInfo = {
            error: error.message,
            operationType: 'create',
            path: 'orders',
            authInfo: {
              userId: user?.uid,
              email: user?.email,
              emailVerified: user?.emailVerified,
              isAnonymous: user?.isAnonymous,
            }
          };
          console.error('Firestore Permission Error:', JSON.stringify(errInfo));
          throw new Error(JSON.stringify(errInfo));
        }
        throw error;
      }
      
      toast.success('Order placed successfully!');
      
      // Simulate a brief delay for payment processing before showing success page
      toast.loading('Finalizing your order...', { duration: 1500 });
      
      setTimeout(() => {
        clearCart();
        navigate('/order-success');
      }, 1500);

    } catch (error: any) {
      console.error('Error placing order:', error);
      let errorMessage = 'Failed to place order. Please try again.';
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.error) errorMessage = `Permission Error: ${parsedError.error}`;
      } catch (e) {
        if (error.message) errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center text-gray-500 hover:text-pink-600 mb-8 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" /> Back to Cart
      </button>

      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping Information */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                <User size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-800">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                    required 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                <MapPin size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-800">Shipping Address</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">State / Province</label>
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Zip / Postal Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" 
                    required 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                <CreditCard size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-800">Payment Method</h2>
            </div>
            <div className="p-6 bg-pink-50/50 rounded-2xl border border-pink-100">
              <p className="text-gray-700 mb-4">You will be redirected to our secure external payment gateway to complete your purchase.</p>
              <div className="flex items-center space-x-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                <span className="text-gray-400">|</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm sticky top-32">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4">
                  <div className="w-16 h-20 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} | {item.selectedSize}</p>
                    <p className="text-sm font-bold text-pink-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pt-6 border-t border-pink-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
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
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-4 rounded-full font-bold hover:bg-pink-700 transition-all flex items-center justify-center shadow-lg shadow-pink-200 group disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Purchase'} 
              {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400">
              <Truck size={14} />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
