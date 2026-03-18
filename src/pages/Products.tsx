import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Collection</h1>
          <p className="text-gray-500 mt-2">Explore our latest premium arrivals</p>
        </div>

        <div className="flex w-full md:w-auto space-x-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:text-emerald-600 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="bg-gray-200 aspect-square rounded-2xl"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 mb-6 shadow-sm group-hover:shadow-xl group-hover:shadow-emerald-500/10 transition-all duration-500">
                    <Link to={`/products/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10">
                      ❤️
                    </button>
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute bottom-4 right-4 bg-white text-emerald-600 p-4 rounded-2xl shadow-lg translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-600 hover:text-white"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                      </Link>
                      <div className="flex items-center text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-gray-400 ml-1">4.9</span>
                      </div>
                    </div>
                    <p className="text-emerald-600 font-extrabold text-xl">${Number(product.price).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
