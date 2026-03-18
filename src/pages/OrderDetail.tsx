import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order } from '../types';
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Clock, CheckCircle, XCircle, HelpCircle, Star, ChevronRight, Package, Truck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, 'order', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { orderId: docSnap.id, ...docSnap.data() } as Order;
        setOrder(data);
        if (data.rating) setRating(data.rating);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `order/${id}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleRating = async (value: number) => {
    if (!id) return;
    setRating(value);
    try {
      await updateDoc(doc(db, 'order', id), { rating: value });
      showToast('Rating updated successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `order/${id}`);
      showToast('Failed to update rating', 'error');
    }
  };

  const cancelOrder = async () => {
    if (!id) return;
    setIsCancelling(true);
    try {
      await updateDoc(doc(db, 'order', id), { status: 'cancelled' });
      showToast('Order cancelled successfully', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `order/${id}`);
      showToast('Failed to cancel order', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Order not found</h1>
        <button onClick={() => navigate('/orders')} className="text-emerald-600 font-bold hover:underline">Back to Orders</button>
      </div>
    );
  }

  const product = order.products?.[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white p-4 font-bold shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/orders')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="text-gray-900 uppercase tracking-wider text-sm">Order Details</span>
        </div>
        <button className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">
          <HelpCircle size={16} />
          Help
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Product Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 flex gap-4 mt-2 border-b border-gray-100"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50">
            {product?.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ShoppingBag size={32} />
              </div>
            )}
          </div>
          <div className="flex-1 py-1">
            <h2 className="font-bold text-gray-900 text-base leading-tight">{product?.name}</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Quantity: {product?.qty}</p>
            <p className="text-emerald-600 font-extrabold mt-2 text-lg">${product?.price.toFixed(2)}</p>
          </div>
        </motion.div>

        {/* ⭐ Rating Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 mt-2 shadow-sm"
        >
          <p className="font-bold text-gray-900 text-sm mb-3">How was the product?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={28}
                  className={`${
                    rating >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">Tap to rate</p>
        </motion.div>

        {/* 🚚 Delivery Status & Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 mt-2 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            {order.status === 'delivered' ? (
              <CheckCircle className="text-emerald-500" size={20} />
            ) : order.status === 'pending' ? (
              <Clock className="text-amber-500" size={20} />
            ) : order.status === 'shipped' ? (
              <Truck className="text-blue-500" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
            <h3 className={`font-bold text-lg ${
              order.status === 'delivered' ? 'text-emerald-600' :
              order.status === 'pending' ? 'text-amber-600' :
              order.status === 'shipped' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {order.status === 'delivered' ? 'Delivered' :
               order.status === 'pending' ? 'Order Placed' :
               order.status === 'shipped' ? 'Shipped' : 'Cancelled'}
            </h3>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-6">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {/* Timeline */}
          <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            <div className="flex items-center gap-4 relative">
              <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 ${order.status !== 'cancelled' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${order.status !== 'cancelled' ? 'text-gray-900' : 'text-gray-400'}`}>Order Placed</p>
                <p className="text-[10px] text-gray-400">We have received your order</p>
              </div>
              <Package size={16} className={order.status !== 'cancelled' ? 'text-emerald-600' : 'text-gray-300'} />
            </div>

            <div className="flex items-center gap-4 relative">
              <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 ${['shipped', 'delivered'].includes(order.status) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${['shipped', 'delivered'].includes(order.status) ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</p>
                <p className="text-[10px] text-gray-400">Your item has been picked up by courier</p>
              </div>
              <Truck size={16} className={['shipped', 'delivered'].includes(order.status) ? 'text-emerald-600' : 'text-gray-300'} />
            </div>

            <div className="flex items-center gap-4 relative">
              <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${order.status === 'delivered' ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</p>
                <p className="text-[10px] text-gray-400">Item has been delivered successfully</p>
              </div>
              <CheckCircle size={16} className={order.status === 'delivered' ? 'text-emerald-600' : 'text-gray-300'} />
            </div>
          </div>
        </motion.div>

        {/* 🔁 Return/Exchange Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 mt-2 shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="text-sm font-bold text-gray-900">No Return / Exchange</p>
            <p className="text-[10px] text-gray-400 font-medium">Policy valid for 7 days after delivery</p>
          </div>
          <button className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">
            Know More
            <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* 📍 Address Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-5 mt-2 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-gray-400" size={18} />
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Delivery Address</h3>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-900 text-sm">{order.name}</p>
            <p className="text-gray-600 text-xs leading-relaxed">{order.address}</p>
            <p className="text-gray-600 text-xs">{order.phone}</p>
          </div>
        </motion.div>

        {/* 💰 Price Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-5 mt-2 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="text-gray-400" size={18} />
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Payment Summary</h3>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium text-sm">Total Price</span>
            <span className="text-2xl font-black text-emerald-600">${order.total.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* ❌ Cancel Button */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 mt-4"
          >
            <button
              onClick={cancelOrder}
              disabled={isCancelling}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-all border border-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle size={20} />
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">
              Order can be cancelled before delivery
            </p>
          </motion.div>
        )}

        {/* Order ID Footer */}
        <div className="p-8 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Order ID: {order.orderId}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
