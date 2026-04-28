import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, TrendingDown, ArrowRight, BrainCircuit, Loader2, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AIInsight {
  summary: string;
  recommendations: {
    crop: string;
    action: string;
    reason: string;
  }[];
  topMovers: {
    crop: string;
    price: string;
    change: string;
    trend: 'up' | 'down';
  }[];
}

export default function AIMarketAssistant() {
  const { t } = useTranslation();
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market/ai-insights');
        if (!response.ok) throw new Error('Failed to fetch AI insights');
        const data = await response.json();
        setInsight(data);
      } catch (err) {
        console.error('AI Insights error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAIInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-emerald-700 font-medium animate-pulse">{t('market.aiLoading')}</p>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
        <BrainCircuit className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400/20 p-2 rounded-xl backdrop-blur-sm border border-emerald-400/30">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{t('market.aiInsights')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Smart Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              {t('market.aiSummary')}
            </div>
            <p className="text-lg text-emerald-50 leading-relaxed font-medium">
              {insight.summary}
            </p>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              {insight.topMovers.map((mover, i) => (
                <div key={i} className="bg-emerald-700/40 p-4 rounded-2xl border border-emerald-600/30 backdrop-blur-sm transition-transform hover:scale-105 cursor-default group">
                  <div className="flex justify-between items-start mb-2 text-emerald-300 group-hover:text-emerald-200">
                    <span className="text-sm font-bold uppercase tracking-wide">{mover.crop}</span>
                    {mover.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-orange-400" />}
                  </div>
                  <div className="text-xl font-bold">{mover.price}</div>
                  <div className={`text-xs font-bold mt-1 ${mover.trend === 'up' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {mover.change} (today)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              {t('market.aiRecommendations')}
            </div>
            <div className="space-y-4">
              {insight.recommendations.map((rec, i) => (
                <div key={i} className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/10 backdrop-blur-md transition-all group flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${rec.action === 'Sell' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {rec.action === 'Sell' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{rec.crop}</span>
                      <ArrowRight className="w-4 h-4 text-white/40" />
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-xs uppercase tracking-wider ${rec.action === 'Sell' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-orange-400/20 text-orange-300'}`}>
                        {rec.action || 'Hold'}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-100/80 leading-snug">
                      {rec.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
