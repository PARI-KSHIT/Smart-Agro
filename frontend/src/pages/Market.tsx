import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Clock, ShoppingBag, Loader2, AlertCircle, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIMarketAssistant from '../components/AIMarketAssistant';

interface CropPrice {
  commodity: string;
  modal_price: string;
  market: string;
  state: string;
  district: string;
  arrival_date: string;
  variety?: string;
}

export default function Market() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState<CropPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market/prices');
        if (!response.ok) throw new Error('Failed to fetch market data');
        const data = await response.json();
        setCrops(data);
        setError(null);
      } catch (err) {
        setError(t('market.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [t]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(crops.map(c => c.state));
    return ['all', ...Array.from(locations)].sort();
  }, [crops]);

  const filteredCrops = useMemo(() => {
    return crops.filter(crop => {
      const matchesSearch = crop.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.variety?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || crop.state === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [crops, searchTerm, selectedLocation]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('market.title')}</h1>
          <p className="text-gray-600 mt-2">{t('market.subtitle')}</p>
        </div>
      </header>

      {/* AI Assistant Section */}
      <AIMarketAssistant />

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group">
        <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-200 opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by AI
        </div>
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('market.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full py-3 px-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer text-gray-700 font-medium appearance-none"
          >
            <option value="all">{t('market.allLocations')}</option>
            {uniqueLocations.filter(l => l !== 'all').map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="font-medium">{t('market.loading')}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-8 rounded-2xl flex flex-col items-center text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-lg font-bold text-red-900">{error}</h3>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCrops.map((item, index) => (
                <motion.div
                  key={`${item.commodity}-${item.market}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                      <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="bg-gray-50 text-gray-500 text-xs font-semibold px-2 py-1 rounded-lg">
                      {item.variety || 'Regular'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.commodity}</h3>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{item.market}, {item.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('market.updated')}: {item.arrival_date}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-emerald-600">₹{item.modal_price}</span>
                    <span className="text-gray-500 text-sm">{t('market.perQuintal')}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCrops.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ShoppingBag className="w-16 h-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">{t('market.noResults')}</p>
            </div>
          )}
        </>
      )}

      {/* Agri Guidelines / Trends */}
      <section className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden mt-12">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Market Outlook & Insights</h2>
          <p className="text-emerald-50/80 max-w-2xl leading-relaxed">
            Stay informed with real-time data from government mandis across India. Prices are updated daily based on market arrivals and trade volumes. For agricultural advice based on these trends, consult our Fertilizer Guide.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4 select-none pointer-events-none">
          <ShoppingBag className="w-80 h-80" />
        </div>
      </section>
    </div>
  );
}
