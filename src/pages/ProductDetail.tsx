import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleWishlist = async () => {
    if (!user) {
      alert("Login first");
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        // ❌ Remove
        const deletePromises = snap.docs.map(docItem => 
          deleteDoc(doc(db, "wishlist", docItem.id))
        );
        await Promise.all(deletePromises);
        console.log("Removed from wishlist:", product.name);
      } else {
        // ✅ Add
        await addDoc(collection(db, "wishlist"), {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          oldPrice: product.oldPrice || Number(product.price) * 1.2,
          inStock: product.inStock ?? true,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0
        });
        console.log("Added to wishlist:", product.name);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

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

  useEffect(() => {
    if (!user || !id) {
      setIsWishlisted(false);
      return;
    }

    const q = query(
      collection(db, 'wishlist'), 
      where('userId', '==', user.uid),
      where('productId', '==', id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsWishlisted(!snapshot.empty);
    });

    return () => unsubscribe();
  }, [user, id]);

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
            <p className="text-3xl font-extrabold text-emerald-600">${Number(product.price).toFixed(2)}</p>
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
              onClick={() => addToCart(product)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-emerald-600/20 group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </button>
            <button 
              onClick={toggleWishlist}
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
    </div>
  );
};

export default ProductDetail;
