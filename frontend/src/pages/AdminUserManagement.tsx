import { useEffect, useState } from 'react';
import { 
  Users, 
  Trash2, 
  Search, 
  MoreVertical, 
  Mail, 
  Calendar,
  User,
  Pencil,
  X,
  Check,
  History,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useAdmin } from '../context/AdminContext';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [historyUser, setHistoryUser] = useState<any | null>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const { adminToken } = useAdmin();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminToken]);

  const fetchUserHistory = async (userId: string) => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/history`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserHistory(data);
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleOpenHistory = (user: any) => {
    setHistoryUser(user);
    fetchUserHistory(user._id);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.ok) {
        setUsers(users.filter(u => u._id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${editUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}` // [x] Admin User Editing <!-- id: 48 -->
                                                  // [x] Add `PUT /api/admin/users/:id` endpoint in backend <!-- id: 49 -->
                                                  // [x] Add Edit action/icon to `AdminUserManagement.tsx` <!-- id: 50 -->
                                                  // [x] Implement Password Visibility Toggle <!-- id: 53 -->
                                                  // [x] Add toggle to `AdminLogin.tsx` <!-- id: 54 -->
                                                  // [x] Add toggle to `Login.tsx` <!-- id: 55 -->
                                                  // [x] Add toggle to `Register.tsx` <!-- id: 56 -->
                                                  // [x] Homepage Content Update <!-- id: 58 -->
                                                  // [x] Update translation files (`en.json`, `hi.json`, `mr.json`) <!-- id: 59 -->
                                                  // [x] Redesign Features section in `Home.tsx` <!-- id: 60 -->
                                                  // [x] Add Benefits section in `Home.tsx` <!-- id: 61 -->
                                                  // [x] Verification and Testing <!-- id: 46 -->
                                                  // [x] Verify admin navigation and user management functionality <!-- id: 47 -->
                                                  // [x] Test user edit flow <!-- id: 52 -->
                                                  // [x] Test password toggles on all pages <!-- id: 57 -->
                                                  // [x] Verify homepage content and translations <!-- id: 62 -->
        },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setUsers(users.map(u => u._id === updated._id ? { ...u, ...updated } : u));
        setEditUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="User Management">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">View, search, and manage registered farmers</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl w-full sm:w-64 focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-200 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No users found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                  <th className="px-8 py-4 font-bold">User Info</th>
                  <th className="px-8 py-4 font-bold">Registration Date</th>
                  <th className="px-8 py-4 font-bold Role">Role</th>
                  <th className="px-8 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    key={user._id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gray-100 flex-shrink-0 relative overflow-hidden group-hover:bg-green-100 transition-colors">
                          {user.profileImage ? (
                            <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                          ) : (
                            <User className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-600 transition-colors" />
                          )}
                        </div>
                        <div>
                          <button 
                            onClick={() => handleOpenHistory(user)}
                            className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors text-left focus:outline-none"
                          >
                            {user.name}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-gray-300" />
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Farmer</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-xl transition-all shadow-sm group/history"
                          title="View Analysis History"
                          onClick={() => handleOpenHistory(user)}
                        >
                          <History className="w-4 h-4 group-hover/history:rotate-12 transition-transform" />
                        </button>
                        <button 
                          className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-green-600 hover:border-green-100 hover:bg-green-50 rounded-xl transition-all shadow-sm"
                          onClick={() => setEditUser(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                          onClick={() => setDeleteId(user._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="md:hidden p-2 text-gray-400">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit User Modal */}
        <AnimatePresence>
          {editUser && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] shadow-2xl p-8 max-w-md w-full relative"
              >
                <button 
                  onClick={() => setEditUser(null)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <Pencil className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
                    <p className="text-sm text-gray-500">Update farmer account details</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateUser} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <input 
                        required
                        type="text" 
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-200 outline-none transition-all font-medium text-gray-800"
                        placeholder="Farmer Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <input 
                        required
                        type="email" 
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-200 outline-none transition-all font-medium text-gray-800"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setEditUser(null)}
                      className="flex-1 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* User History Modal */}
        <AnimatePresence>
          {historyUser && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col relative"
              >
                <button 
                  onClick={() => setHistoryUser(null)}
                  className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-gray-600 rounded-xl transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                  <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex-shrink-0">
                    {historyUser.profileImage ? (
                      <img src={historyUser.profileImage} className="w-full h-full object-cover" alt={historyUser.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-600">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{historyUser.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        {historyUser.email}
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Member since {new Date(historyUser.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-8 bg-gray-50/30">
                  {isHistoryLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium">Fetching analysis records...</p>
                    </div>
                  ) : userHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="bg-white p-6 rounded-3xl shadow-sm mb-6">
                        <History className="w-12 h-12 text-gray-200" />
                      </div>
                      <p className="text-xl font-bold text-gray-800">No History Records</p>
                      <p className="text-gray-500 max-w-xs mx-auto mt-2">This user hasn't performed any crop analyses yet. Records will appear here once they scan a crop.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userHistory.map((record) => (
                        <motion.div 
                          key={record._id}
                          whileHover={{ y: -4 }}
                          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group"
                        >
                          <div className="h-48 relative overflow-hidden">
                            <img 
                              src={record.imageUrl} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                              alt={record.diseaseName} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                              <div>
                                <h4 className="text-white font-bold text-lg">{record.diseaseName}</h4>
                                <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(record.analyzedAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                              <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                Diagnosis Complete
                              </span>
                              <ExternalLink className="w-4 h-4 text-gray-300 hover:text-green-600 transition-colors cursor-pointer" />
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                              {record.description}
                            </p>
                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Verified Result</span>
                              </div>
                              <button 
                                onClick={() => setSelectedRecord(record)}
                                className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                Details <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t border-gray-50 flex justify-end">
                  <button 
                    onClick={() => setHistoryUser(null)}
                    className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* History Detail Deep-Dive Modal */}
        <AnimatePresence>
          {selectedRecord && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col relative border border-white/20"
              >
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="absolute top-8 right-8 z-20 p-3 bg-white/90 backdrop-blur-md text-gray-500 hover:text-gray-800 rounded-2xl transition-all shadow-lg hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="h-72 flex-shrink-0 relative">
                  <img src={selectedRecord.imageUrl} className="w-full h-full object-cover" alt="Disease" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-10">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-4 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-green-500/30">
                          AI Diagnosis
                        </span>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedRecord.analyzedAt).toLocaleString()}
                        </div>
                      </div>
                      <h3 className="text-4xl font-black text-white tracking-tight leading-none uppercase">
                        {selectedRecord.diseaseName}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-10 space-y-10 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-1 bg-green-600 rounded-full"></div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disease Description</p>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                      {selectedRecord.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[32px] bg-emerald-50/50 border border-emerald-100/50 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-emerald-100 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
                      <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Recommended Fertilizer
                      </h4>
                      <p className="text-emerald-700 font-bold text-lg leading-snug">
                        {selectedRecord.recommendedFertilizer}
                      </p>
                    </div>

                    <div className="p-8 rounded-[32px] bg-amber-50/50 border border-amber-100/50 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-amber-100 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
                      <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Prevention Strategy
                      </h4>
                      <p className="text-amber-700 font-bold text-sm leading-relaxed">
                        {selectedRecord.preventionTips}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <div className="flex items-center gap-4 text-gray-400 group cursor-default">
                      <ShieldCheck className="w-10 h-10 group-hover:text-green-600 transition-colors" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-1">Status: Verified</p>
                        <p className="text-xs font-bold text-gray-500">Analysis results matched with AI crop genome bank v3.0</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="px-14 py-4.5 bg-gray-900 text-white font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl shadow-gray-400"
                  >
                    Close Report
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
              >
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete User?</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeleteId(null)}
                    className="py-3.5 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(deleteId)}
                    className="py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
