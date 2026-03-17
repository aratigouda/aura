import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6">Get in Touch</h1>
        <p className="text-lg text-gray-600">
          Have a question about our collection or an existing order? We're here to help. Reach out to us and we'll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-pink-50 shadow-sm">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mb-6">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-500">hello@aurashine.com</p>
              <p className="text-gray-500">support@aurashine.com</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-pink-50 shadow-sm">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mb-6">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-500">+1 (234) 567-890</p>
              <p className="text-gray-500">Mon-Fri: 9am - 6pm</p>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-pink-50 shadow-sm flex items-start space-x-6">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-pink-500">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Visit Our Studio</h3>
              <p className="text-gray-500 leading-relaxed">
                123 Elegance Street, Fashion District<br />
                New York, NY 10001, United States
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 sm:p-12 rounded-[3rem] border border-pink-50 shadow-xl shadow-pink-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                <input type="text" className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                <input type="text" className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input type="email" className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
              <textarea rows={5} className="w-full px-6 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200" required></textarea>
            </div>
            <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-all flex items-center justify-center group">
              Send Message <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
