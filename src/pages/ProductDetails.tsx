import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, ChevronLeft, Star, Share2, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-pink-600 font-bold">Back to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-pink-600 mb-8 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-pink-50 shadow-sm">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white border border-pink-50 cursor-pointer hover:border-pink-300 transition-colors">
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <p className="text-pink-400 font-bold uppercase tracking-widest text-sm mb-2">{product.category}</p>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-gray-400 text-sm">(48 Reviews)</span>
            </div>
            <p className="text-3xl font-bold text-pink-600">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Color Selection */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">Color: <span className="text-pink-500">{selectedColor}</span></h3>
            <div className="flex space-x-3">
              {product.colors.map(color => (
                <button 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-pink-500 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">Size: <span className="text-pink-500">{selectedSize}</span></h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded-full border transition-all ${
                    selectedSize === size 
                      ? 'bg-pink-600 border-pink-600 text-white' 
                      : 'bg-white border-pink-100 text-gray-600 hover:border-pink-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
            <div className="flex items-center border border-pink-100 rounded-full px-4 py-2 bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-400 hover:text-pink-600">-</button>
              <span className="px-6 font-bold text-gray-800">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-400 hover:text-pink-600">+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-grow bg-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-700 transition-all flex items-center justify-center shadow-lg shadow-pink-200"
            >
              <ShoppingBag className="mr-2" size={20} /> Add to Cart
            </button>

            <button 
              onClick={() => toggleWishlist(product)}
              className={`p-4 rounded-full border transition-all ${
                isInWishlist(product.id)
                  ? 'bg-pink-50 border-pink-200 text-pink-600'
                  : 'bg-white border-pink-100 text-gray-400 hover:text-pink-600'
              }`}
            >
              <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Extra Info */}
          <div className="pt-8 border-t border-pink-100 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Truck size={16} className="text-pink-400" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Share2 size={16} className="text-pink-400" />
              <span>Share this product</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
