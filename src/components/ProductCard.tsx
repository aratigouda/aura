import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-pink-50"
    >
      <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            New Arrival
          </span>
        )}
        {product.isTrending && (
          <span className="absolute top-4 left-4 bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-500">
            Trending
          </span>
        )}
      </Link>

      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-sm transition-colors ${
          isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/80 text-gray-400 hover:text-pink-500'
        }`}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div className="p-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-gray-800 font-medium text-lg hover:text-pink-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-pink-600 font-bold mt-1">${product.price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
