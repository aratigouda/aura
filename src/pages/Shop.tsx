import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = ['All', 'Dresses', 'Sarees', 'Tops', 'Bottoms'];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Our Collection</h1>
          <p className="text-pink-400 mt-2">Showing {filteredProducts.length} products</p>
        </div>

        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-pink-100 px-6 py-3 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer pr-12"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-grow md:flex-grow-0">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-pink-100 px-6 py-3 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer pr-12"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No products found in this category.</p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="mt-4 text-pink-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
