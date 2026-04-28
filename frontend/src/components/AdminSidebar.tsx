import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Bell,
  Search,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { useState } from 'react';
import AdminProfileModal from './AdminProfileModal';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { adminLogout, admin } = useAdmin();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white text-gray-800 z-50
          transition-all duration-300 ease-in-out w-72
          flex flex-col border-r border-gray-100 shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-between">
          <NavLink to="/admin/dashboard" className="flex items-center gap-3">
            <div className="bg-green-600 p-2.5 rounded-2xl shadow-lg shadow-green-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">AdminPanel</span>
              <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Smart Agro</span>
            </div>
          </NavLink>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Profile Section */}
        <div 
          onClick={() => setIsProfileOpen(true)}
          className="mx-6 mb-8 p-4 bg-green-50/50 rounded-2xl border border-green-100/50 flex items-center gap-3 cursor-pointer hover:bg-green-100/50 transition-colors group"
        >
          <img 
            src={admin?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
            className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
            alt="Admin"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm truncate group-hover:text-green-700 transition-colors">{admin?.name || 'System Admin'}</span>
            <span className="text-[10px] text-gray-500 truncate">{admin?.email}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-200 translate-x-1' 
                  : 'hover:bg-green-50 text-gray-600 hover:text-green-700'}
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110`} />
              <span className="font-bold text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile Modal */}
        <AdminProfileModal 
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />

        {/* Logout */}
        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
