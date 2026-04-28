import { AlertCircle, CheckCircle, Droplet, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DiseaseResultProps {
  diseaseName: string;
  description: string;
  recommendedFertilizer: string;
  preventionTips: string;
}

export default function DiseaseResult({ diseaseName, description, recommendedFertilizer, preventionTips }: DiseaseResultProps) {
  const { t } = useTranslation();
  const isHealthy = diseaseName.toLowerCase().includes('healthy') || diseaseName.toLowerCase().includes('स्वस्थ') || diseaseName.toLowerCase().includes('निरोगी');

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className={`p-6 flex items-center gap-4 text-white ${isHealthy ? 'bg-emerald-600' : 'bg-red-600'}`}>
        {isHealthy ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
        <div>
          <h2 className="text-2xl font-bold">{diseaseName}</h2>
          <p className="text-white/80">{isHealthy ? t('detect.result.healthyMsg') : t('detect.result.diseaseMsg')}</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <InfoIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">{t('detect.result.description')}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <Droplet className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">{t('detect.result.fertilizer')}</h3>
            </div>
            <p className="text-emerald-800 leading-relaxed">{recommendedFertilizer}</p>
          </section>

          <section className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-900">{t('detect.result.prevention')}</h3>
            </div>
            <p className="text-amber-800 leading-relaxed">{preventionTips}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
