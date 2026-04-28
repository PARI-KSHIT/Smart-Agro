import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  History,
  Sprout, 
  CloudSun, 
  LogOut, 
  X,
  Leaf,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const navItems = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.detect'), path: '/detect', icon: Search },
    { name: t('nav.history'), path: '/analysis-history', icon: History },
    { name: t('nav.fertilizer'), path: '/fertilizers', icon: Sprout },
    { name: t('nav.weather'), path: '/weather', icon: CloudSun },
    { name: t('nav.market'), path: '/market', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-emerald-900 text-emerald-50 z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          flex flex-col shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Toggle Button - Desktop Only */}
        <button 
          onClick={onToggleCollapse}
          className={`
            hidden md:flex absolute -right-4 top-17 bg-emerald-600 text-white w-8 h-8 rounded-full 
            items-center justify-center shadow-xl border-2 border-emerald-500 
            hover:bg-emerald-500 hover:scale-110 transition-all z-[60] cursor-pointer
          `}
        >
          {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        {/* Header */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="bg-emerald-600 p-2 rounded-xl shadow-lg flex-shrink-0"
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-xl tracking-wide whitespace-nowrap overflow-hidden"
                >
                  Smart Agro
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-emerald-800 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-grow px-3 space-y-6 mt-4 ${isCollapsed ? 'items-center' : ''}`}>
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) => `
                  flex items-center rounded-xl transition-all duration-200 group relative
                  ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
                  ${isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 translate-x-1' 
                    : 'hover:bg-emerald-800/50 text-emerald-100 hover:text-white'}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110`} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium text-sm lg:text-base whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-emerald-800 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-emerald-700">
                    {item.name}
                  </div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Info / Logout */}
        <div className={`p-4 mt-auto border-t border-emerald-800/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}
            onClick={handleLogout}
            className={`
              flex items-center rounded-xl text-emerald-100 transition-all duration-200 group relative
              ${isCollapsed ? 'justify-center p-3 w-auto' : 'gap-3 w-full px-4 py-3'}
            `}
            title={isCollapsed ? t('nav.logout') : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium text-sm lg:text-base whitespace-nowrap overflow-hidden"
                >
                  {t('nav.logout')}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-red-800 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-red-700">
                {t('nav.logout')}
              </div>
            )}
          </motion.button>
        </div>
      </aside>
    </>
  );
}
