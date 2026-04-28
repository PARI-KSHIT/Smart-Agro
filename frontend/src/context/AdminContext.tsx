import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  name: string;
  email: string;
  profileImage?: string;
}

interface AdminContextType {
  adminToken: string | null;
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  adminLogin: (token: string, admin: Admin) => void;
  adminLogout: () => void;
  updateAdmin: (admin: Admin) => void;
  isAdminLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const savedAdmin = localStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('admin');
    if (savedToken && savedAdmin) {
      setAdminToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setIsAdminLoading(false);
  }, []);

  const adminLogin = (newToken: string, newAdmin: Admin) => {
    setAdminToken(newToken);
    setAdmin(newAdmin);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('admin', JSON.stringify(newAdmin));
  };

  const adminLogout = () => {
    setAdminToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  };

  const updateAdmin = (newAdmin: Admin) => {
    setAdmin(newAdmin);
    localStorage.setItem('admin', JSON.stringify(newAdmin));
  };

  return (
    <AdminContext.Provider value={{
      adminToken,
      admin,
      isAdminAuthenticated: !!adminToken,
      adminLogin,
      adminLogout,
      updateAdmin,
      isAdminLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
