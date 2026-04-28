import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Shield, 
  Activity, 
  CheckCircle2, 
  ArrowLeft,
  Save,
  Loader2,
  Sprout,
  ShieldAlert,
  Droplet,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/user/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [token]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const response = await fetch('/api/user/profile', {
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          profileImage: user?.profileImage
        })
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        updateUser(updatedUserData);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    { label: t('dashboard.stats.totalScans'), value: history.length, icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: t('dashboard.stats.diseasesDetected'), value: history.filter(r => r.diseaseName.toLowerCase() !== 'healthy').length, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: t('dashboard.stats.fertilizersSuggested'), value: history.filter(r => r.recommendedFertilizer && r.recommendedFertilizer.toLowerCase() !== 'none').length, icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm uppercase tracking-widest group"
        >
          <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Dashboard
        </button>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-xl shadow-emerald-900/5 border border-white overflow-hidden"
        >
          {/* Header/Cover */}
          <div className="h-48 bg-gradient-to-r from-emerald-600 transition-all duration-700 to-teal-700 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          </div>

          <div className="px-8 pb-12 relative">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 mb-10">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[32px] border-8 border-white shadow-2xl bg-emerald-50 overflow-hidden relative">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-emerald-200" />
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]"
                  >
                    <Camera className="w-8 h-8 text-white mb-2" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest text-center px-4">Change Photo</span>
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="flex-grow pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" /> {user?.email}
                    </p>
                  </div>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 active:scale-95"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-4 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-3xl font-black text-sm uppercase tracking-widest transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 flex items-center gap-2 active:scale-95"
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-3xl flex items-center gap-3 mb-8 font-bold"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Profile updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Stats */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Activity Summary</h3>
                  <div className="space-y-8">
                    {stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-gray-900 leading-none">{isLoadingHistory ? '...' : stat.value}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-8 rounded-[32px] border border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-emerald-700 uppercase tracking-[0.2em]">Account Status</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-emerald-800">Verified Farmer Pro</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Information */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-[0.1em]">User Information</h3>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-6 py-4 rounded-2xl border transition-all duration-200 outline-none font-bold ${
                          isEditing 
                            ? 'bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5' 
                            : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'
                        }`}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-6 py-4 rounded-2xl border transition-all duration-200 outline-none font-bold ${
                          isEditing 
                            ? 'bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5' 
                            : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'
                        }`}
                        placeholder="Your email address"
                      />
                      <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Used for system communication and verification.</p>
                    </div>

                    <div className="pt-4 p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                      <div className="mt-1">
                        <Info className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Advanced Security</h4>
                        <p className="text-xs text-amber-700/80 font-medium leading-relaxed">Your data is secured using industry-standard encryption. We never share your personal information with third parties without your explicit consent.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
