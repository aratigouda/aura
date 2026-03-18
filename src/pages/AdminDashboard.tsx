import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order, Product } from '../types';
import { Package, ShoppingBag, Plus, Edit2, Trash2, CheckCircle, Truck, Clock, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'All',
  });

  useEffect(() => {
    const ordersQuery = query(collection(db, 'order'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as any);
      });
      setOrders(ordersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'order');
    });

    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'order', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `order/${orderId}`);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      description: formData.description,
      category: formData.category,
      createdAt: new Date().toISOString(),
    };

    try {
      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          id: `PROD-${Date.now()}`,
        });
      }
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', image: '', description: '', category: 'All' });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      category: product.category || 'All',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your store's orders and inventory</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Products
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-8">
          {orders.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders placed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {orders.map((order) => (
                <motion.div 
                  key={order.orderId}
                  layout
                  className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-50">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Order ID</span>
                        <span className="text-sm font-bold text-gray-900">{order.orderId}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{order.name}</h3>
                      <p className="text-sm text-gray-500">{order.email} • {order.phone}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 flex items-center space-x-2 ${
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {order.status === 'pending' ? <Clock size={14} /> :
                         order.status === 'shipped' ? <Truck size={14} /> :
                         <CheckCircle size={14} />}
                        <span>{order.status}</span>
                      </span>
                      <p className="text-2xl font-extrabold text-emerald-600">${Number(order.total).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{order.address}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Update Status</h4>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleStatusUpdate((order as any).id, 'shipped')}
                          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          Mark Shipped
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate((order as any).id, 'delivered')}
                          className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          Mark Delivered
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Products</h4>
                    <div className="flex flex-wrap gap-4">
                      {order.products.map((p, i) => (
                        <div key={i} className="bg-gray-50 px-4 py-2 rounded-xl flex items-center space-x-3 border border-gray-100">
                          <span className="text-sm font-bold text-gray-900">{p.name}</span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">x{p.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: '', price: '', image: '', description: '' });
                setIsModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-white/90 backdrop-blur-md text-emerald-600 rounded-xl shadow-lg hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-white/90 backdrop-blur-md text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-emerald-600 font-extrabold text-2xl mb-4">${Number(product.price).toFixed(2)}</p>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                    placeholder="Premium Watch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                      placeholder="99.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
                    <input
                      type="url"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm resize-none"
                    placeholder="Describe the product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="Saree">Saree</option>
                    <option value="Kids">Kids</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
