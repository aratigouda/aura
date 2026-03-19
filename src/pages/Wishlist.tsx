import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../types";
import { Heart, ShoppingCart, ArrowLeft, Share2, Eye, CheckCircle2, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'wishlist' | 'shared' | 'viewed'>('wishlist');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleWishlist = async (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      alert("Login first");
      navigate('/login');
      return;
    }

    try {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid),
        where("productId", "==", item.id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        // ❌ Remove
        const deletePromises = snap.docs.map(docItem => 
          deleteDoc(doc(db, "wishlist", docItem.id))
        );
        await Promise.all(deletePromises);
        console.log("Removed from wishlist:", item.name);
      } else {
        // ✅ Add
        await addDoc(collection(db, "wishlist"), {
          userId: user.uid,
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          // Adding extra fields for the UI
          oldPrice: item.oldPrice || item.price * 1.2,
          inStock: item.inStock ?? true,
          rating: item.rating || 4.5,
          reviews: item.reviews || 0
        });
        console.log("Added to wishlist:", item.name);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "wishlist"),
      where("userId", "==", user.uid)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.data().productId, // Use productId as the id for the UI
        ...doc.data(),
        isWishlisted: true
      })) as Product[];
      setProducts(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const filteredProducts = products.filter(p => {
    if (showInStockOnly && !p.inStock) return false;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm border-b border-gray-100"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="font-bold text-lg tracking-tight text-gray-900 uppercase">My Products</h1>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 sticky top-[65px] z-10">
        {[
          { id: 'wishlist', label: 'Wishlist', icon: Heart },
          { id: 'shared', label: 'Shared', icon: Share2 },
          { id: 'viewed', label: 'Viewed', icon: Eye }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-sm font-medium flex flex-col items-center gap-1 transition-all relative ${
              activeTab === tab.id ? "text-pink-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "fill-pink-500" : ""}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Toggle */}
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100 mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className={`w-5 h-5 ${showInStockOnly ? "text-green-500" : "text-gray-300"}`} />
          <span className="text-sm font-medium text-gray-700">Show in stock products only</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={showInStockOnly}
            onChange={() => setShowInStockOnly(!showInStockOnly)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
        </label>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading your favorites...</p>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center py-32 px-10 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login to see your wishlist</h2>
          <p className="text-gray-500 text-sm mb-8">Save items you love to your wishlist and they'll show up here.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform"
          >
            Login Now
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 p-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
                onClick={() => navigate(`/products/${item.id}`)}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      !item.inStock ? "opacity-40 grayscale" : ""
                    }`}
                  />

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleWishlist(e, item);
                    }}
                    className="absolute top-2 right-2 cursor-pointer transition-transform duration-200 active:scale-125 z-20"
                  >
                    {item.isWishlisted ? (
                      <span className="text-red-500 text-xl">❤️</span>
                    ) : (
                      <span className="text-gray-400 text-xl">🤍</span>
                    )}
                  </div>

                  {/* Out of Stock Overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
                    {item.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-bold text-gray-900">₹{item.price}</span>
                    <span className="line-through text-gray-400 text-[10px]">₹{item.oldPrice}</span>
                    <span className="text-green-600 text-[10px] font-bold">
                      {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className="mt-2 flex flex-col gap-0.5">
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      COD Available
                    </p>
                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      Free Delivery
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-3 pt-2 border-t border-gray-50">
                    <div className="flex items-center bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.rating} <span className="ml-0.5 text-[8px]">★</span>
                    </div>
                    <span className="text-[10px] text-gray-400 ml-1.5 font-medium">
                      ({item.reviews})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 px-10 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Save items you love to your wishlist and they'll show up here.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
