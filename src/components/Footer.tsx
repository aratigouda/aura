import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 mb-6 block">
              LUXE<span className="text-emerald-600">SHOP</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Elevating your lifestyle with curated premium products. Quality meets design in every piece we offer.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">All Products</Link></li>
              <li><Link to="/products?category=new" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?category=featured" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <MapPin size={18} className="text-emerald-600" />
                <span>123 Design St, Creative City, 10001</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <Phone size={18} className="text-emerald-600" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <Mail size={18} className="text-emerald-600" />
                <span>hello@luxeshop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} LUXESHOP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
