import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login: userLogin } = useAuth();
  const { adminLogin } = useAdmin();

  // State
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync state with location
  useEffect(() => {
    if (location.pathname === '/register') {
      setTab('signup');
      setRole('user');
    } else if (location.pathname === '/admin/login') {
      setTab('login');
      setRole('admin');
    }
  }, [location.pathname]);

  const { isAdminAuthenticated } = useAdmin();
  const { isAuthenticated: isUserAuthenticated } = useAuth();
  
  // CRITICAL SIDE-EFFECT FOR REDIRECTING
  // This handles the navigation AFTER the context has been updated.
  useEffect(() => {
    if (role === 'admin' && isAdminAuthenticated && !isLoading) {
      const from = (location.state as any)?.from?.pathname;
      // Safety: Only redirect to 'from' if it's actually an admin path
      const target = from && from.startsWith('/admin') ? from : '/admin/dashboard';
      
      console.log('✅ Context Ready: Redirecting Admin to:', target);
      const timer = setTimeout(() => {
        navigate(target, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    } else if (role === 'user' && isUserAuthenticated && !isLoading) {
      const from = (location.state as any)?.from?.pathname;
      // Safety: Only redirect to 'from' if it's NOT an admin path
      const target = from && !from.startsWith('/admin') ? from : '/dashboard';

      console.log('✅ Context Ready: Redirecting User to:', target);
      const timer = setTimeout(() => {
        navigate(target, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAdminAuthenticated, isUserAuthenticated, role, isLoading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let endpoint = '';
      let body = {};

      if (role === 'user') {
        if (tab === 'login') {
          endpoint = '/api/auth/login';
          body = { email, password };
        } else {
          endpoint = '/api/auth/register';
          body = { name, email, password };
        }
      } else {
        if (tab === 'login') {
          endpoint = '/api/admin/login';
          body = { email, password };
        } else {
          throw new Error('Admin registration is not available.');
        }
      }
      console.log('Login attempt started:', { role, tab, email });
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        if (role === 'user') {
          userLogin(data.token, data.user);
        } else {
          adminLogin(data.token, data.admin);
        }
      } else {
        throw new Error('Server returned an unexpected response format.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f1] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-emerald-100 min-h-[600px]">

        {/* Left Side: Branding Sidebar */}
        <div className="w-full md:w-[42%] bg-emerald-600 relative overflow-hidden flex flex-col p-10 text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
              alt="Farm"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <Link to="/" className="flex items-center gap-2 text-emerald-50 hover:text-white transition-colors mb-auto group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>

            <div className="mb-8">
              <div className="bg-white/20 p-4 rounded-2xl w-fit mb-8 backdrop-blur-md border border-white/10 shadow-xl">
                {role === 'user' ? (
                  <Leaf className="w-10 h-10 text-white" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="text-[2.75rem] font-black leading-tight mb-4 tracking-tight uppercase">
                Welcome <br /> Back!
              </h1>
              <p className="text-emerald-50 text-lg leading-relaxed max-w-sm font-medium opacity-90">
                {role === 'user'
                  ? 'Access your personalized agricultural dashboard and track your crop health and market trends.'
                  : 'Securely manage your agricultural ecosystem and monitor user activities with Smart Agro\'s premium admin suite.'
                }
              </p>
            </div>

            <div className="mt-auto opacity-60 text-xs font-semibold tracking-widest uppercase">
              Professional Agricultural AI System v3.0
            </div>
          </div>

          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-[-5%] left-[-5%] w-32 h-32 bg-yellow-200 rounded-full opacity-10 blur-2xl"></div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-[58%] p-8 md:p-14 flex flex-col justify-center bg-white relative">

          {/* Tab Switcher */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-10 w-fit mx-auto border border-gray-100 shadow-inner">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === 'login' ? 'bg-white text-emerald-600 shadow-md transform scale-100' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => { setTab('signup'); setRole('user'); setError(''); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === 'signup' ? 'bg-white text-emerald-600 shadow-md transform scale-100' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Role Selector */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => { setRole('user'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all duration-300 ${role === 'user'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100'
                  : 'border-gray-100 text-gray-400 hover:border-emerald-200 hover:bg-gray-50'
                }`}
            >
              <User className={`w-5 h-5 ${role === 'user' ? 'text-emerald-600' : ''}`} />
              <span className="font-bold">User</span>
            </button>
            {tab === 'login' && (
              <button
                onClick={() => { setRole('admin'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all duration-300 ${role === 'admin'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100'
                    : 'border-gray-100 text-gray-400 hover:border-emerald-200 hover:bg-gray-50'
                  }`}
              >
                <ShieldCheck className={`w-5 h-5 ${role === 'admin' ? 'text-emerald-600' : ''}`} />
                <span className="font-bold">Admin</span>
              </button>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                {error}
              </div>
            )}

            {tab === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 border shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 border shadow-sm"
                  placeholder="farmer@smartagro.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 border shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4.5 px-8 rounded-3xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 group transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-lg uppercase tracking-tight"
              >
                {isLoading ? (
                  <div className="w-7 h-7 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {tab === 'login' ? 'Login' : 'Create Account'}
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer of form area */}
          {role === 'user' && (
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm font-medium">
                {tab === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setRole('user'); setError(''); }}
                  className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all"
                >
                  {tab === 'login' ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
