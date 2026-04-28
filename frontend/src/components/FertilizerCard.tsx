import { Info, Activity, Clock, ShieldCheck, Tag, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FertilizerProps {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  price?: number;
  usageInstructions: string;
  suitableCrops: string[];
  quantity: string;
  frequency: string;
  benefits: string[];
}

export default function FertilizerCard({ 
  name, 
  type,
  description,
  imageUrl, 
  price, 
  usageInstructions = '', 
  suitableCrops = [],
  quantity,
  frequency,
  benefits = [] 
}: FertilizerProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-emerald-50 group flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {type && (
          <div className="absolute top-4 left-4">
            <span className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-white/20">
              {type}
            </span>
          </div>
        )}
        {price && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-white/90 backdrop-blur-md text-emerald-700 px-4 py-2 rounded-2xl text-lg font-black shadow-xl">
              ${price.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
            {name}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quantity && (
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Droplets className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{t('fertilizer.dosage')}</span>
              </div>
              <p className="text-gray-800 text-sm font-bold truncate">{quantity}</p>
            </div>
          )}
          {frequency && (
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{t('fertilizer.frequency')}</span>
              </div>
              <p className="text-gray-800 text-sm font-bold truncate">{frequency}</p>
            </div>
          )}
        </div>

        <div className="space-y-6 mb-8 flex-grow">
          {usageInstructions && (
            <div>
              <div className="flex items-center gap-2 text-gray-900 mb-3">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">{t('fertilizer.usage')}</h4>
              </div>
              <div className="text-gray-700 text-sm space-y-2 leading-relaxed">
                {usageInstructions.split('\n').filter(step => step.trim()).map((step, i) => (
                  <p key={i} className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    {step}
                  </p>
                ))}
              </div>
            </div>
          )}

          {benefits.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-gray-900 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">{t('fertilizer.benefits')}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-emerald-100/40 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200/50">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suitableCrops.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-gray-900 mb-3">
                <Tag className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">{t('fertilizer.suitableFor')}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {suitableCrops.map((crop, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-lg border border-gray-200">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center bg-gray-50 text-emerald-600 p-4 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all font-black text-sm uppercase tracking-widest gap-3">
            <Info className="w-6 h-6" />
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
