import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070" 
          alt="About Us" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <h1 className="text-6xl font-serif font-bold">Our Story</h1>
          <p className="text-xl text-pink-100 tracking-widest uppercase">Elegance Redefined</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Crafting Timeless Beauty</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded in 2020, Aurashine was born out of a passion for traditional craftsmanship and a vision for modern elegance. We believe that every woman deserves to feel radiant and confident in what she wears.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our collections are a tribute to the rich heritage of textiles, reimagined for the contemporary woman. From the intricate weaves of our sarees to the flowing silhouettes of our dresses, every piece is a work of art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mx-auto">
              <Heart size={32} />
            </div>
            <h3 className="font-bold text-xl">Made with Love</h3>
            <p className="text-gray-500">Every stitch is infused with care and attention to detail.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mx-auto">
              <Sparkles size={32} />
            </div>
            <h3 className="font-bold text-xl">Premium Quality</h3>
            <p className="text-gray-500">We use only the finest fabrics sourced from ethical suppliers.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mx-auto">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-xl">Empowering Women</h3>
            <p className="text-gray-500">Our team is 90% women, from design to delivery.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pink-50 rounded-[3rem] p-16 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Ready to Shine?</h2>
            <p className="text-gray-600 text-lg">Explore our latest collection and find the perfect piece for your next special occasion.</p>
          </div>
          <Link to="/shop" className="bg-pink-600 text-white px-10 py-5 rounded-full font-bold hover:bg-pink-700 transition-all flex items-center group shadow-xl shadow-pink-200">
            Shop the Collection <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
