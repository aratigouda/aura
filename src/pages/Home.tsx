import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl space-y-6"
          >
            <span className="text-pink-600 font-bold tracking-widest uppercase text-sm">New Collection 2026</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight">
              Radiate Elegance with <span className="text-pink-500">Aurashine</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Discover our latest collection of premium ladies' wear, where traditional craftsmanship meets modern sophistication.
            </p>
            <div className="flex space-x-4 pt-4">
              <Link to="/shop" className="bg-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-700 transition-all flex items-center group">
                Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/about" className="bg-white text-pink-600 border border-pink-200 px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Star className="text-pink-500" />, title: "Premium Quality", desc: "Handpicked fabrics and meticulous stitching." },
            { icon: <Truck className="text-pink-500" />, title: "Fast Delivery", desc: "Free shipping on all orders over $100." },
            { icon: <Shield className="text-pink-500" />, title: "Secure Payment", desc: "100% secure payment processing." }
          ].map((feature, i) => (
            <div key={i} className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-pink-50 shadow-sm">
              <div className="p-3 bg-pink-50 rounded-xl">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Trending Now</h2>
            <p className="text-pink-400">Most loved pieces from our collection</p>
          </div>
          <Link to="/shop" className="text-pink-600 font-bold hover:underline flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000' },
              { name: 'Sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000' },
              { name: 'Tops', img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=1000' }
            ].map((cat, i) => (
              <Link 
                key={i} 
                to={`/shop?category=${cat.name}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-lg"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-4xl font-serif font-bold tracking-widest">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pink-600 rounded-[3rem] p-12 text-center text-white space-y-6">
          <h2 className="text-4xl font-serif font-bold">Join the Aurashine Club</h2>
          <p className="text-pink-100 max-w-md mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="max-w-md mx-auto flex space-x-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-6 py-4 rounded-full text-gray-900 focus:outline-none"
            />
            <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all">
              Join
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
