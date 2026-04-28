import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Globe, AlertCircle, Sprout } from 'lucide-react';
import { motion } from 'motion/react';

export default function SearchFertilizers() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' fertilizer usage and benefits')}`;
    window.open(googleSearchUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6"
          >
            <Sprout className="w-4 h-4" />
            {t('fertilizer.title')}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            {t('fertilizer.title')}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t('fertilizer.subtitle')}
          </p>
        </div>

        {/* Simplified Search Container */}
        <div className="relative group">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
              <Search className="w-full h-full" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (showWarning) setShowWarning(false);
              }}
              placeholder={t('fertilizer.searchPlaceholder')}
              className="w-full pl-16 pr-44 py-6 bg-white border-2 border-transparent shadow-2xl shadow-emerald-100/50 rounded-[2.5rem] focus:border-emerald-500 focus:ring-0 transition-all font-medium text-xl text-gray-800 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {t('fertilizer.searchBtn')}
            </button>
          </form>

          {/* Warning Message */}
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-12 left-0 right-0 flex justify-center"
            >
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4" />
                {t('fertilizer.emptyWarning')}
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['Urea', 'DAP', 'NPK 19-19-19', 'Organic Compost', 'Neem Cake'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(tag + ' fertilizer usage and benefits')}`;
                window.open(googleSearchUrl, '_blank');
              }}
              className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
