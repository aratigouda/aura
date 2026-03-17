import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-pink-50 pt-16 pb-8 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-pink-600">
              AURASHINE
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Elegance in every thread. Discover our curated collection of premium ladies' wear designed for the modern woman.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-400 hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-pink-400 hover:text-pink-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-pink-400 hover:text-pink-600 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-600 hover:text-pink-500 transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=Dresses" className="text-gray-600 hover:text-pink-500 transition-colors">Dresses</Link></li>
              <li><Link to="/shop?category=Sarees" className="text-gray-600 hover:text-pink-500 transition-colors">Sarees</Link></li>
              <li><Link to="/shop?category=Tops" className="text-gray-600 hover:text-pink-500 transition-colors">Tops</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-600 hover:text-pink-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-pink-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-pink-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-pink-500 transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-600">
                <MapPin size={18} className="text-pink-400" />
                <span>123 Elegance St, Fashion City</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Phone size={18} className="text-pink-400" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Mail size={18} className="text-pink-400" />
                <span>hello@aurashine.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-pink-100 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Aurashine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
