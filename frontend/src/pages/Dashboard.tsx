import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Droplet, ShieldAlert, Info, X, ExternalLink, Sprout, Cloud, Navigation, Loader2, FileText } from 'lucide-react';
import { generatePDFReport } from '../utils/reportGenerator';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import FarmingCalendar from '../components/FarmingCalendar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchWeather = async (lat?: number, lon?: number) => {
      setWeatherLoading(true);
      try {
        const API_KEY = 'a406ecbae33271ee688840efc601d3f0';
        const locParam = lat ? `lat=${lat}&lon=${lon}` : `q=New Delhi`;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${locParam}&appid=${API_KEY}&units=metric`);
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (e) {
        console.error('Weather fetch error:', e);
      } finally {
        setWeatherLoading(false);
      }
    };

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
        } else {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
    fetchWeather();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const getWeeklyData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString(i18n.language, { weekday: 'short' });
      const dateString = date.toLocaleDateString();
      
      const dayScans = history.filter(r => new Date(r.analyzedAt).toLocaleDateString() === dateString);
      const dayDiseases = dayScans.filter(r => r.diseaseName.toLowerCase() !== 'healthy');
      
      days.push({
        day: dayName,
        scans: dayScans.length,
        diseases: dayDiseases.length
      });
    }
    return days;
  };

  const weeklyData = getWeeklyData();
  const maxVal = Math.max(...weeklyData.map(d => d.scans), 5);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('dashboard.title')}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => generatePDFReport(history, user, t)}
              className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileText className="w-5 h-5 text-emerald-600" />
              {t('dashboard.generateReport')}
            </button>
            <button 
              onClick={() => navigate('/analysis-history')}
              className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-2xl font-bold border border-emerald-200 hover:bg-emerald-200 transition-colors shadow-sm"
            >
              <Calendar className="w-5 h-5" />
              {t('analysisHistory.viewAll')}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sprout className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{t('dashboard.stats.totalScans')}</p>
              <h4 className="text-3xl font-black text-gray-900 leading-none">{history.length}</h4>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{t('dashboard.stats.diseasesDetected')}</p>
              <h4 className="text-3xl font-black text-gray-900 leading-none">
                {history.filter(r => r.diseaseName.toLowerCase() !== 'healthy').length}
              </h4>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplet className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{t('dashboard.stats.fertilizersSuggested')}</p>
              <h4 className="text-3xl font-black text-gray-900 leading-none">
                {history.filter(r => r.recommendedFertilizer && r.recommendedFertilizer.toLowerCase() !== 'none').length}
              </h4>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl shadow-lg border border-transparent flex items-center gap-4 text-white relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center relative z-10">
              {weatherLoading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Cloud className="w-7 h-7" />
              )}
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-[0.2em] mb-1">{t('dashboard.stats.todayWeather')}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-3xl font-black">
                  {weather ? `${Math.round(weather.main.temp)}°` : '--°'}
                </h4>
                {weather && (
                  <span className="text-xs font-bold text-emerald-100/90 uppercase tracking-wider">
                    {weather.weather[0].main}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('dashboard.chart.title')}</h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.chart.scans')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.chart.diseases')}</span>
              </div>
            </div>
          </div>

          <div className="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
            <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-t border-gray-100 w-full h-0"></div>
              ))}
            </div>

            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div className="flex gap-1 items-end w-full max-w-[60px] h-full justify-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.scans / maxVal) * 100}%` }}
                    className="w-3 sm:w-5 bg-emerald-500 rounded-t-lg relative group/bar transition-all duration-300 hover:bg-emerald-600 shadow-[0_-4px_12px_rgba(16,185,129,0.1)]"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                      {data.scans} {t('dashboard.chart.scans')}
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.diseases / maxVal) * 100}%` }}
                    className="w-3 sm:w-5 bg-amber-400 rounded-t-lg relative group/bar transition-all duration-300 hover:bg-amber-500 shadow-[0_-4px_12px_rgba(251,191,36,0.1)]"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                      {data.diseases} {t('dashboard.chart.diseases')}
                    </div>
                  </motion.div>
                </div>
                <span className="mt-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Farming Calendar Section */}
        <FarmingCalendar />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/detect')}
            className="cursor-pointer bg-emerald-600 p-8 rounded-[40px] shadow-xl text-white flex flex-col justify-between h-48 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform">
              <ShieldAlert className="w-24 h-24" />
            </div>
            <h3 className="text-2xl font-black">{t('nav.detect')}</h3>
            <p className="text-emerald-100 font-medium">Protect your crops from diseases with AI assistance.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/weather')}
            className="cursor-pointer bg-white p-8 rounded-[40px] shadow-lg border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-600 group-hover:scale-125 transition-transform">
              <Navigation className="w-24 h-24" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{t('nav.weather')}</h3>
            <p className="text-gray-500 font-medium whitespace-pre-wrap">Get detailed forecast and agricultural climate advice.</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
