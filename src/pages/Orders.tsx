import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { ShoppingBag, Search, Filter, ChevronRight, Clock, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'order'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ orderId: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
        <a href="/login" className="text-emerald-600 font-bold">Login</a>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wider">My Orders</h1>
          <ShoppingBag className="text-emerald-600" size={20} />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border-b border-gray-100 mb-4">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders by ID or product..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No orders found</h2>
            <p className="text-gray-500 text-sm mb-6">Try searching for something else or browse products.</p>
            <a href="/products" className="text-emerald-600 font-bold text-sm">Browse Products</a>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const firstProduct = order.products?.[0];
            const otherProductsCount = order.products.length - 1;

            return (
              <motion.div 
                key={order.orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/order/${order.orderId}`)}
                className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 hover:border-emerald-100 transition-colors cursor-pointer group"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50">
                  {firstProduct?.image ? (
                    <img
                      src={firstProduct.image}
                      alt={firstProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-500' :
                      order.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`}></span>
                    <h3 className="font-bold text-gray-900 truncate">
                      {order.status === 'delivered' ? 'Delivered' :
                       order.status === 'shipped' ? 'On the way' :
                       order.status === 'pending' ? 'Order Placed' : 'Cancelled'}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md font-bold">
                      Qty: {firstProduct?.qty || 1}
                    </p>
                    {otherProductsCount > 0 && (
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        + {otherProductsCount} more item{otherProductsCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-300 group-hover:text-emerald-500 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
