import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order, Product, UserProfile } from '../types';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Truck, 
  Clock, 
  X, 
  Users, 
  DollarSign, 
  BarChart3,
  Search,
  Mail,
  Calendar,
  Shield,
  Bell,
  HelpCircle,
  Settings,
  MessageSquare,
  Globe,
  Star,
  ChevronDown,
  Menu,
  ExternalLink,
  BookOpen,
  Award,
  TrendingUp,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'orders' | 'products' | 'users'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData: UserProfile[] = [];
      snapshot.forEach((doc) => {
        usersData.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(usersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeUsers();
    };
  }, []);

  const totalSales = orders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const todaySales = orders
    .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, order) => acc + (Number(order.total) || 0), 0);

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
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteDoc(doc(db, 'products', productToDelete));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productToDelete}`);
    }
    setProductToDelete(null);
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

  const handleRoleToggle = async (uid: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
        {[
          { label: 'MARKETPLACES', value: '1', icon: <Globe size={14} /> },
          { label: 'ORDERS', value: orders.length.toString(), icon: null },
          { label: "TODAY'S SALES", value: `₹${todaySales.toLocaleString()}`, icon: null },
          { label: 'BUYER MESSAGES', value: '0', icon: null },
          { label: 'BUY BOX WINS', value: '0%', icon: null },
          { label: 'ACCOUNT HEALTH', value: 'Healthy', icon: <Shield size={14} className="text-emerald-500" /> },
          { label: 'CUSTOMER FEEDBACK', value: '5.0', icon: <Star size={14} className="text-amber-400 fill-amber-400" /> },
          { label: 'TOTAL BALANCE', value: `₹${totalSales.toLocaleString()}`, icon: null },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-3 flex flex-col justify-between min-h-[80px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-medium text-[#008296]">{stat.value}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ship Orders Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Ship Orders</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-600 mb-4">You have orders to ship</p>
            <div className="text-6xl font-light text-gray-900 mb-6">{pendingOrders}</div>
            <p className="text-xs text-gray-500 mb-8">You must buy shipping or confirm shipment of these orders to be paid</p>
            <button 
              onClick={() => setActiveView('orders')}
              className="w-full bg-[#008296] hover:bg-[#006d7e] text-white py-2 rounded-sm text-sm font-medium transition-colors"
            >
              Ship Your Orders
            </button>
          </div>
        </div>

        {/* News Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">News</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 space-y-4 flex-1">
            {[
              { date: 'MAR 27, 2026', title: 'New size attributes now available for Listing Apparel products', link: '#' },
              { date: 'MAR 25, 2026', title: 'Get personalized recommendations to grow your business', link: '#' },
              { date: 'MAR 20, 2026', title: 'Amazon Seller Central and the seller mobile app are now available in...', link: '#' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</p>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                <a href={item.link} className="text-xs text-[#008296] hover:underline flex items-center">
                  Read more <ExternalLink size={10} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Explore FBA Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Explore FBA</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600 mb-4">Use Fulfillment by Amazon to offer Prime shipping</p>
            <div className="flex-1 bg-gray-50 rounded-sm mb-4 flex items-center justify-center p-4">
              <Package size={64} className="text-gray-200" />
            </div>
            <button className="w-full bg-[#008296] hover:bg-[#006d7e] text-white py-2 rounded-sm text-sm font-medium transition-colors">
              Get Started with FBA
            </button>
          </div>
        </div>

        {/* Tutorials Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Tutorials and Training</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600 mb-4">Learn how to sell on Amazon</p>
            <div className="flex-1 bg-gray-50 rounded-sm mb-4 flex items-center justify-center p-4">
              <BookOpen size={64} className="text-gray-200" />
            </div>
            <button className="w-full bg-[#008296] hover:bg-[#006d7e] text-white py-2 rounded-sm text-sm font-medium transition-colors">
              Visit Seller University
            </button>
          </div>
        </div>

        {/* Seller Rewards Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Seller Rewards</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600 mb-4">Participate to win rewards</p>
            <div className="flex-1 bg-gray-50 rounded-sm mb-4 flex items-center justify-center p-4">
              <Award size={64} className="text-gray-200" />
            </div>
          </div>
        </div>

        {/* Seller Forums Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Seller Forums</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 space-y-4 flex-1">
            {[
              { date: 'FEB 9, 2021', title: 'Buyer cheated me any legal action I can take', link: '#' },
              { date: 'FEB 7, 2021', title: 'How to handle returns for high-value items?', link: '#' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</p>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                <a href={item.link} className="text-xs text-[#008296] hover:underline flex items-center">
                  Read more <ExternalLink size={10} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Growth</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600 mb-4">Explore opportunities to grow</p>
            <div className="flex-1 bg-gray-50 rounded-sm mb-4 flex items-center justify-center p-4">
              <TrendingUp size={64} className="text-gray-200" />
            </div>
          </div>
        </div>

        {/* Appstore Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Appstore</h3>
            <button className="text-gray-400"><Settings size={16} /></button>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600 mb-4">Discover apps to help you sell</p>
            <div className="flex-1 bg-gray-50 rounded-sm mb-4 flex items-center justify-center p-4">
              <Layout size={64} className="text-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Orders</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{orders.length} orders found</span>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#008296]">{order.orderId}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.name}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-tight ${
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">₹{Number(order.total).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleStatusUpdate((order as any).id, 'shipped')}
                      className="text-[10px] font-bold text-[#008296] hover:underline"
                    >
                      Ship
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate((order as any).id, 'delivered')}
                      className="text-[10px] font-bold text-[#008296] hover:underline"
                    >
                      Deliver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Manage Inventory</h2>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', price: '', image: '', description: '', category: 'All' });
            setIsModalOpen(true);
          }}
          className="bg-[#008296] hover:bg-[#006d7e] text-white px-6 py-2 rounded-sm font-medium text-sm transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add a Product</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by product name, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-[#008296] focus:border-[#008296] transition-all outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-sm overflow-hidden flex flex-col group">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(product)}
                    className="p-2 bg-white shadow-md text-gray-600 hover:text-[#008296] rounded-sm"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-white shadow-md text-gray-600 hover:text-red-600 rounded-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-gray-900">₹{Number(product.price).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{product.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRoleToggle(user.uid, user.role)}
                      className="text-[10px] font-bold text-[#008296] hover:underline"
                    >
                      Toggle Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3] font-sans">
      {/* Top Navbar */}
      <header className="bg-[#232f3e] text-white">
        <div className="max-w-[1440px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Menu size={20} className="lg:hidden" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight">amazon</span>
                <span className="text-xs font-medium text-amber-400 -mt-1">seller central</span>
              </div>
            </div>
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              {['Catalogue', 'Inventory', 'Pricing', 'Orders', 'Advertising', 'Growth', 'Reports', 'Performance', 'Appstore', 'Services', 'B2B'].map(item => (
                <button 
                  key={item} 
                  onClick={() => {
                    if (item === 'Orders') setActiveView('orders');
                    if (item === 'Inventory') setActiveView('products');
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center"
                >
                  {item} <ChevronDown size={12} className="ml-1 opacity-50" />
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 text-xs font-medium">
              <span>Wali associates | India</span>
              <ChevronDown size={12} className="opacity-50" />
            </div>
            <div className="hidden md:flex items-center space-x-1 text-xs font-medium">
              <span>English</span>
              <ChevronDown size={12} className="opacity-50" />
            </div>
            <div className="relative hidden lg:block">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-white text-gray-900 text-xs py-1.5 pl-8 pr-4 rounded-sm w-48 outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <MessageSquare size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <HelpCircle size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <Settings size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header / Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 h-10 flex items-center space-x-4 text-xs font-medium text-gray-500">
          <button onClick={() => setActiveView('dashboard')} className={`hover:text-[#008296] ${activeView === 'dashboard' ? 'text-[#008296] font-bold' : ''}`}>Dashboard</button>
          <span className="opacity-30">|</span>
          <button onClick={() => setActiveView('orders')} className={`hover:text-[#008296] ${activeView === 'orders' ? 'text-[#008296] font-bold' : ''}`}>Orders</button>
          <span className="opacity-30">|</span>
          <button onClick={() => setActiveView('products')} className={`hover:text-[#008296] ${activeView === 'products' ? 'text-[#008296] font-bold' : ''}`}>Inventory</button>
          <span className="opacity-30">|</span>
          <button onClick={() => setActiveView('users')} className={`hover:text-[#008296] ${activeView === 'users' ? 'text-[#008296] font-bold' : ''}`}>Users</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'orders' && renderOrders()}
            {activeView === 'products' && renderProducts()}
            {activeView === 'users' && renderUsers()}
          </motion.div>
        </AnimatePresence>
      </main>

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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Edit Product' : 'Add a New Product'}
              </h2>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-[#008296] focus:border-[#008296] transition-all outline-none text-sm"
                    placeholder="e.g. Silk Saree"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-[#008296] focus:border-[#008296] transition-all outline-none text-sm"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select
                      required
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-[#008296] focus:border-[#008296] transition-all outline-none text-sm"
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-[#008296] focus:border-[#008296] transition-all outline-none text-sm"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-[#008296] focus:border-[#008296] transition-all outline-none text-sm resize-none"
                    placeholder="Product details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#008296] hover:bg-[#006d7e] text-white font-bold py-2.5 rounded-sm transition-all shadow-md"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default AdminDashboard;
