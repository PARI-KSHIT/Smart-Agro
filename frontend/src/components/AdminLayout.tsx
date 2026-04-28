import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, Bell, User, Check, Clock, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { admin, adminToken } = useAdmin();

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [adminToken]);

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:pl-72 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-2xl transition-all relative ${showNotifications ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right font-sans"
                    >
                      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-green-600 uppercase tracking-widest hover:text-green-700 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Bell className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n, i) => (
                            <div
                              key={i}
                              className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex gap-4 ${!n.isRead ? 'bg-green-50/30' : ''}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${n.type === 'user_registration' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {n.type === 'user_registration' ? <User className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                              </div>
                              <div className="flex-grow">
                                <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-medium">
                                  <Clock className="w-3 h-3" />
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              {!n.isRead && (
                                <div className="flex-shrink-0 pt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                        <button className="text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
                          View All Activity
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-none">{admin?.name}</p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-100">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
