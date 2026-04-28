import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from './AIAssistant';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Area */}
      <div className={`
        flex-grow flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}
      `}>
        {/* Pass the toggle function to Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* AI Assistant Floating Component */}
        <AIAssistant />
      </div>
    </div>
  );
}
