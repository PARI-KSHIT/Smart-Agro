import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User as UserIcon, Globe, Menu, Camera, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token, updateUser } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: user?.name,
            email: user?.email,
            profileImage: base64String
          })
        });

        if (response.ok) {
          const updatedUserData = await response.json();
          updateUser(updatedUserData);
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <nav className={`bg-emerald-700 text-white shadow-md transition-all duration-300 ${isAuthenticated ? 'sticky top-0 z-30' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - Only show when authenticated and on mobile */}
            {isAuthenticated && (
              <button 
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-emerald-800 rounded-lg transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
            )}
            
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-emerald-100" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">Smart Agro</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated && (
               <Link to="/weather" className="hover:text-emerald-200 transition-colors text-sm font-medium mr-2 flex items-center gap-1.5">
                 <Globe className="w-4 h-4" />
                 {t('nav.weather')}
               </Link>
            )}
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-emerald-800/50 px-3 py-1.5 rounded-lg border border-emerald-600/30">
              <Globe className="w-4 h-4 text-emerald-200" />
              <select 
                value={i18n.language} 
                onChange={changeLanguage}
                className="bg-transparent text-white text-sm outline-none cursor-pointer"
              >
                <option value="en" className="text-gray-900">English</option>
                <option value="hi" className="text-gray-900">हिंदी</option>
                <option value="mr" className="text-gray-900">मराठी</option>
              </select>
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 bg-emerald-800/50 hover:bg-emerald-800 rounded-full border border-emerald-600/30 transition-all duration-200 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center border-2 border-emerald-500 overflow-hidden shadow-sm">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-emerald-200 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 flex flex-col items-center text-center">
                         <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2 border-2 border-emerald-50 relative group cursor-pointer overflow-hidden">
                            {user?.profileImage ? (
                              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon className="w-8 h-8 text-emerald-600" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Camera className="w-5 h-5 text-white" />
                            </div>
                         </div>
                         <h4 className="text-sm font-bold text-gray-900">{user?.name}</h4>
                         <p className="text-xs text-gray-500 truncate w-full">{user?.email}</p>
                      </div>

                      <div className="px-2 py-2">
                        <Link 
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                           <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                           <span>View Profile</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group mt-1"
                        >
                          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                          <span>{t('nav.logout')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <UserIcon className="w-4 h-4 text-emerald-200" />
                <span className="font-medium">{t('nav.login')} / {t('nav.register')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
