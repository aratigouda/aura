import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ShoppingBag, ArrowRight, ArrowLeft, CreditCard, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { cart, total: cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { product: directProduct } = location.state || {};
  
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderId: "ORD-" + Date.now(),
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,

        products: directProduct ? [{
          name: directProduct.name,
          price: Number(directProduct.price),
          image: directProduct.image,
          qty: 1,
          selectedSize: directProduct.selectedSize,
          easyReturn: directProduct.easyReturn
        }] : cart.map(item => ({
          name: item.name,
          price: Number(item.price),
          image: item.image,
          qty: item.quantity,
          selectedSize: item.selectedSize,
          easyReturn: item.easyReturn
        })),

        total: directProduct ? Number(directProduct.price) : cart.reduce((a, b) => a + Number(b.price), 0),
        paymentMethod,
        status: "pending",

        createdAt: new Date().toISOString()
      };

      // 1. Save to Firestore
      try {
        await addDoc(collection(db, 'order'), orderData);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'order');
      }

      // 2. Optional: Save to Google Sheets (Mocked URL as per instructions)
      // The user provided a URL in the prompt context history, but I should use a generic one or the one they provided if I can find it.
      // Re-reading the prompt: "Optional: Save order data to Google Sheets"
      // I'll use a placeholder URL if not provided, but I'll implement the fetch.
      const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzE8W5MkFsUJslhCOcSG9wWmTSkxLccqWDHUPIn2C-4Ey3CqUe3_JB2fsVpr3sAlMo/exec';
      
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
      } catch (err) {
        console.warn('Google Sheets sync failed', err);
      }

      clearCart();
      toast.success("Order Placed Successfully ✅");
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!directProduct && cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const displayProducts = directProduct ? [directProduct] : cart;
  const displayTotal = directProduct ? Number(directProduct.price) : Number(cartTotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-emerald-600 font-bold flex items-center space-x-2 transition-colors">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
              <Truck className="text-emerald-600" size={24} />
              <span>Shipping Information</span>
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                  placeholder="123 Design St"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                    placeholder="Creative City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Method</label>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="ml-3 text-sm font-bold text-gray-900">Cash on Delivery</span>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <span className="ml-3 text-sm font-bold text-gray-900">UPI Payment</span>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                    />
                    <span className="ml-3 text-sm font-bold text-gray-900">Pay Online</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-emerald-600/20 group disabled:opacity-50"
                >
                  <CreditCard size={22} className="group-hover:scale-110 transition-transform" />
                  <span>{loading ? 'Processing...' : 'Place Order'}</span>
                </button>
              </div>
            </form>
          </motion.div>

          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Premium Quality</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
              {displayProducts.map((item, idx) => (
                <div key={directProduct ? idx : (item as any).cartItemId} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {directProduct ? 1 : (item as any).quantity}</p>
                    {item.selectedSize && <p className="text-[10px] text-gray-400">Size: {item.selectedSize}</p>}
                  </div>
                  <p className="text-sm font-bold text-gray-900">₹{(Number(item.price) * (directProduct ? 1 : (item as any).quantity)).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{displayTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-extrabold text-emerald-600">₹{displayTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
