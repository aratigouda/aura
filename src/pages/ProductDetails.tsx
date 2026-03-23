import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [easyReturn, setEasyReturn] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const goToReview = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (easyReturn === null) {
      toast.error("Please select return option");
      return;
    }
    
    navigate("/review", { state: { 
      product: {
        ...product,
        selectedSize,
        easyReturn,
        price: product.easyReturn ? product.price + 20 : product.price
      }
    } });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-gray-200 aspect-square rounded-3xl"></div>
          <div className="space-y-8">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <button onClick={() => navigate('/products')} className="mt-4 text-emerald-600 font-bold hover:underline">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors mb-12 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square overflow-hidden rounded-[3rem] bg-gray-50 shadow-2xl shadow-gray-200/50"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm uppercase tracking-widest">
              <span>New Arrival</span>
              <span>•</span>
              <div className="flex items-center text-amber-400">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold text-gray-400 ml-1">4.9 (120 reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-extrabold text-emerald-600">₹{Number(product.price).toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Description</h3>
            <p className="text-gray-500 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 py-8 border-y border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Truck size={20} /></div>
              <span className="text-sm font-medium text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={20} /></div>
              <span className="text-sm font-medium text-gray-600">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><RefreshCw size={20} /></div>
              <span className="text-sm font-medium text-gray-600">30-Day Returns</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-emerald-600/20 group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </button>
            <button 
              onClick={() => setShowPopup(true)}
              className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-gray-900/20 group"
            >
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              <span>Buy Now</span>
            </button>
            <button 
              onClick={() => product && addToWishlist(product)}
              className={`px-6 py-5 rounded-2xl border-2 transition-all flex items-center justify-center ${
                isWishlisted 
                  ? 'border-red-100 bg-red-50 text-red-500' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Buy Now Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-8 sm:p-10 overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden"></div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setSelectedSize("Free Size")}
                      className={`px-8 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        selectedSize === "Free Size" 
                          ? "border-emerald-600 bg-emerald-50 text-emerald-600" 
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      Free Size
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Returns</h3>
                  <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">Choose your preference</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setEasyReturn(true)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        easyReturn === true 
                          ? "border-emerald-600 bg-emerald-50" 
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-bold ${easyReturn === true ? "text-emerald-600" : "text-gray-900"}`}>YES</span>
                        <span className="text-emerald-600 font-black text-sm">₹{(Number(product.price) + 20).toFixed(0)}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">Full protection & easy returns</p>
                    </button>
                    <button 
                      onClick={() => setEasyReturn(false)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        easyReturn === false 
                          ? "border-emerald-600 bg-emerald-50" 
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-bold ${easyReturn === false ? "text-emerald-600" : "text-gray-900"}`}>NO</span>
                        <span className="text-gray-900 font-black text-sm">₹{Number(product.price).toFixed(0)}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">Standard policy applies</p>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={goToReview}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-3"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
