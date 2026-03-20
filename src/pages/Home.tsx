import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, limit, getDocs, where, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ArrowRight, ShoppingBag, Star, ShieldCheck, Truck, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToWishlist, isInWishlist } = useWishlist();

  const categories = ["All", "Saree", "Kids", "Beauty", "Footwear"];

  const handleWishlist = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to add items to your wishlist");
      navigate('/login');
      return;
    }

    addToWishlist(item);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), limit(12)); // Increased limit
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      setFeaturedProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) {
      setFeaturedProducts(prev => prev.map(p => ({ ...p, isWishlisted: false })));
      return;
    }

    const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const wishlistIds = snap.docs.map(d => d.data().productId);

      setFeaturedProducts(prev =>
        prev.map(p => ({
          ...p,
          isWishlisted: wishlistIds.includes(p.id)
        }))
      );
    });

    return () => unsub();
  }, [user]);

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-24">
      {/* Search Bar */}
      <div className="p-4 bg-white sticky top-[64px] z-40 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto space-y-4">
          <input 
            type="text"
            placeholder="Search products..."
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Category Navigation */}
          <div className="flex overflow-x-auto space-x-6 py-2 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className="min-w-[80px] flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-110' 
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}>
                  <ShoppingBag size={24} />
                </div>
                <p className={`text-xs mt-2 font-bold uppercase tracking-widest transition-colors ${
                  selectedCategory === cat ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {cat}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">New Collection 2026</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
              Redefine Your <br />
              <span className="text-emerald-500 italic">Everyday Style</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg">
              Discover our curated selection of premium essentials designed for the modern lifestyle. Quality that speaks for itself.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center space-x-2 group">
                <span>Shop Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-all text-center">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Global Shipping</h3>
            <p className="text-gray-500 text-sm">Fast and reliable delivery to over 50 countries worldwide.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Secure Payments</h3>
            <p className="text-gray-500 text-sm">Your transactions are protected by industry-leading encryption.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
              <Star size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Premium Quality</h3>
            <p className="text-gray-500 text-sm">Every product is hand-picked and tested for excellence.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Products</h2>
            <p className="text-gray-500 mt-2">Our most loved items this season</p>
          </div>
          <Link to="/products" className="text-emerald-600 font-bold flex items-center space-x-2 hover:text-emerald-700 transition-colors group">
            <span>View All</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-gray-200 aspect-square rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4 relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <div
                      onClick={(e) => handleWishlist(e, product)}
                      className="absolute top-4 right-4 cursor-pointer transition-transform duration-200 active:scale-125 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white"
                    >
                      <Heart 
                        size={20} 
                        className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-400"} 
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-emerald-600 font-bold">₹{Number(product.price).toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Ready to upgrade your lifestyle?</h2>
            <p className="text-emerald-100 text-lg mb-10">Join our community and get exclusive early access to new drops and special offers.</p>
            <Link to="/signup" className="bg-white text-emerald-600 px-10 py-4 rounded-full font-bold hover:bg-emerald-50 transition-all inline-block">
              Get Started Now
            </Link>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
