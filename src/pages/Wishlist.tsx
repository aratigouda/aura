import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-50 rounded-full text-pink-300 mb-4">
          <Heart size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">Your wishlist is empty</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Save your favorite items to your wishlist and they'll be here when you're ready to buy.
        </p>
        <Link to="/shop" className="inline-block bg-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-700 transition-all">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">My Wishlist</h1>
          <p className="text-pink-400 mt-2">{wishlist.length} items saved</p>
        </div>
        <Link to="/shop" className="text-pink-600 font-bold hover:underline flex items-center">
          Continue Shopping <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
