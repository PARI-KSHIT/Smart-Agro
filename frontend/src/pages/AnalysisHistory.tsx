import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Droplet, ShieldAlert, Info, X, ExternalLink, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

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
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('analysisHistory.deleteConfirm'))) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/user/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setHistory(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting history:', error);
      alert('An error occurred while deleting the record');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('analysisHistory.title')}</h2>
            <p className="text-gray-500 mt-2 text-lg">{t('analysisHistory.subtitle')}</p>
          </div>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl font-bold border border-emerald-200 shadow-sm">
            {history.length} {t('dashboard.records')}
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">{t('dashboard.noHistory')}</p>
            <button
              onClick={() => navigate('/detect')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {t('home.getStarted')}
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {history.map((record) => (
              <div key={record._id}>
                <div className="flex justify-end gap-3 mb-2">
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors group"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('analysisHistory.delete')}
                  </button>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group"
                  >
                    <Info className="w-4 h-4" />
                    {t('dashboard.learnMore')}
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300">
                  <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-100">
                    <img src={record.imageUrl} alt={record.diseaseName} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(record.analyzedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{record.diseaseName}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{record.description}</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-900 text-xs uppercase tracking-wider">{t('detect.result.fertilizer')}</span>
                        </div>
                        <p className="text-emerald-800 text-sm line-clamp-2 font-medium">{record.recommendedFertilizer}</p>
                      </div>
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          <span className="font-semibold text-amber-900 text-xs uppercase tracking-wider">{t('detect.result.prevention')}</span>
                        </div>
                        <p className="text-amber-800 text-sm line-clamp-2 font-medium">{record.preventionTips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="relative h-48 sm:h-64 flex-shrink-0">
                <img src={selectedRecord.imageUrl} alt={selectedRecord.diseaseName} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">
                    <Info className="w-3.5 h-3.5" />
                    {t('dashboard.diseaseDetails')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedRecord.diseaseName}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{selectedRecord.description}</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplet className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-emerald-900 text-base">{t('detect.result.fertilizer')}</h4>
                    </div>
                    <p className="text-emerald-800 leading-relaxed">{selectedRecord.recommendedFertilizer}</p>
                  </div>

                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                      <h4 className="font-bold text-amber-900 text-base">{t('detect.result.prevention')}</h4>
                    </div>
                    <p className="text-amber-800 leading-relaxed">{selectedRecord.preventionTips}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="bg-gray-100 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    {t('dashboard.close')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
