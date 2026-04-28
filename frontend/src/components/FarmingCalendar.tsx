import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Sprout, Droplets, Info } from 'lucide-react';

interface CropSchedule {
  name: string;
  sowing: number[]; // Months (0-11)
  fertilizer: { month: number; task: string }[];
}

const CROP_SAMPLES: CropSchedule[] = [
  {
    name: 'Wheat',
    sowing: [10, 11], // Nov, Dec
    fertilizer: [
      { month: 10, task: 'Basal Dose: Urea (50kg/ha) + DAP (100kg/ha)' },
      { month: 11, task: 'First Top Dressing: Urea (50kg/ha) at 21 days' },
      { month: 0, task: 'Second Top Dressing: Urea (50kg/ha) at 45 days' }
    ]
  },
  {
    name: 'Rice (Paddy)',
    sowing: [5, 6], // June, July
    fertilizer: [
      { month: 5, task: 'Nursery: Zinc Sulphate + Urea' },
      { month: 6, task: 'Transplanting: DAP + MOP' },
      { month: 7, task: 'Tillering: Urea Top Dressing' },
      { month: 8, task: 'Panicle Initiation: Urea + Potash' }
    ]
  },
  {
    name: 'Soybean',
    sowing: [5, 6], // June, July
    fertilizer: [
      { month: 5, task: 'At Sowing: DAP (125kg/ha) + Sulphur' },
      { month: 7, task: 'Pod Filling: Foliar spray of NPK' }
    ]
  },
  {
    name: 'Cotton',
    sowing: [4, 5], // May, June
    fertilizer: [
      { month: 4, task: 'Basal: DAP + MOP + Urea' },
      { month: 6, task: 'Squaring Stage: Urea Top Dressing' },
      { month: 8, task: 'Boll Development: NPK Foliar Spray' }
    ]
  },
  {
    name: 'Mustard',
    sowing: [9, 10], // Oct, Nov
    fertilizer: [
      { month: 9, task: 'At Sowing: Urea + Single Super Phosphate' },
      { month: 10, task: 'First Irrigation: Urea Top Dressing' }
    ]
  }
];

export default function FarmingCalendar() {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString(i18n.language, { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentMonth + 1, 1));
  };

  const sowingCrops = CROP_SAMPLES.filter(crop => crop.sowing.includes(currentMonth));
  const fertilizerTasks = CROP_SAMPLES.flatMap(crop => 
    crop.fertilizer.filter(f => f.month === currentMonth).map(f => ({ crop: crop.name, task: f.task }))
  );

  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Side: Calendar */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-50 bg-gray-50/50 lg:w-1/3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-100">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t('farmingCalendar.title')}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{monthName} {year}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d} className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(b => <div key={`b-${b}`} className="aspect-square" />)}
            {days.map(d => {
              const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div 
                  key={d} 
                  className={`aspect-square flex items-center justify-center text-xs font-bold rounded-lg transition-all
                    ${isToday ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-emerald-50 text-gray-600'}`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Info Sections */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {/* Sowing Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-gray-900">{t('farmingCalendar.sowingTime')}</h4>
            </div>
            <div className="space-y-2">
              {sowingCrops.length > 0 ? (
                sowingCrops.map(crop => (
                  <motion.div 
                    key={crop.name}
                    whileHover={{ x: 3 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50 transition-colors hover:bg-emerald-50"
                  >
                    <span className="text-sm font-bold text-emerald-900">{crop.name}</span>
                    <span className="text-[8px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {t('farmingCalendar.month')}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-gray-400 font-medium italic">{t('farmingCalendar.noSowing')}</p>
              )}
            </div>
          </div>

          {/* Fertilizer Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-gray-900">{t('farmingCalendar.fertilizerSchedule')}</h4>
            </div>
            <div className="space-y-2">
              {fertilizerTasks.length > 0 ? (
                fertilizerTasks.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 3 }}
                    className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/50 transition-colors hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold text-blue-900">{item.crop}</span>
                      <Info className="w-3 h-3 text-blue-400" />
                    </div>
                    <p className="text-[10px] text-blue-700 font-medium leading-relaxed">{item.task}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-gray-400 font-medium italic">{t('farmingCalendar.noFertilizer')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
