import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            My Wishlist <Heart className="text-red-500 fill-red-500" size={32} />
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Items you've saved for later</p>
        </div>
        
        {wishlistItems.length > 0 && (
          <button 
            onClick={() => navigate('/products')}
            className="hidden sm:flex items-center space-x-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors group"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {wishlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-16 border border-dashed border-gray-200 text-center shadow-sm"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-gray-300" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Explore our collection and save your favorite premium items here.
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center space-x-2 mx-auto"
            >
              <ShoppingBag size={20} />
              <span>Start Shopping</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
              >
                <div 
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md text-red-500 rounded-2xl shadow-lg hover:bg-red-50 transition-colors z-10"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div 
                    className="cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-2xl font-black text-emerald-600">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                      {item.oldPrice && (
                        <p className="text-sm text-gray-400 line-through font-medium">
                          ₹{Number(item.oldPrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-gray-900/10 group/btn"
                  >
                    <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
