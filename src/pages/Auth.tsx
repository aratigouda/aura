import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-pink-100 overflow-hidden border border-pink-50"
      >
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? 'Sign in to continue your shopping journey' : 'Join Aurashine and start your elegant journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 transition-all"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-pink-50/50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 flex items-center justify-center group"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pink-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or continue with</span></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 py-4 border border-pink-100 rounded-2xl hover:bg-pink-50 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-gray-700">Google</span>
          </button>

          <p className="mt-10 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
