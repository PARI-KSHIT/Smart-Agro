import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useTranslation } from 'react-i18next';
import UploadImage from '../components/UploadImage';
import DiseaseResult from '../components/DiseaseResult';

export default function DetectDisease() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert(t('detect.loginRequired'));
        setIsLoading(false);
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = error => reject(error);
      });
      
      const base64Image = await base64Promise;
      const mimeType = file.type;

      // Determine language for AI prompt
      const langMap: Record<string, string> = {
        en: 'English',
        hi: 'Hindi',
        mr: 'Marathi'
      };
      const targetLang = langMap[i18n.language] || 'English';

      // Call Gemini API directly from frontend
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: `Analyze this plant leaf image. Identify the disease, provide a short description, recommend a fertilizer, and give prevention tips. Return the result strictly as a JSON object with keys: diseaseName, description, recommendedFertilizer, preventionTips. IMPORTANT: Translate all the values in the JSON object into ${targetLang}.`
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diseaseName: { type: Type.STRING },
              description: { type: Type.STRING },
              recommendedFertilizer: { type: Type.STRING },
              preventionTips: { type: Type.STRING }
            },
            required: ['diseaseName', 'description', 'recommendedFertilizer', 'preventionTips']
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error('No response from Gemini API');
      }

      const analysisResult = JSON.parse(resultText);

      // Save to history via backend
      const saveResponse = await fetch('/api/disease/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: `data:${mimeType};base64,${base64Image}`,
          diseaseName: analysisResult.diseaseName,
          description: analysisResult.description,
          recommendedFertilizer: analysisResult.recommendedFertilizer,
          preventionTips: analysisResult.preventionTips
        })
      });

      if (!saveResponse.ok) {
        console.error('Failed to save history');
      }

      setResult(analysisResult);
    } catch (error: any) {
      console.error(error);
      alert(t('detect.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t('detect.title')}</h1>
          <p className="text-lg text-gray-600">{t('detect.subtitle')}</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <UploadImage onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DiseaseResult 
              diseaseName={result.diseaseName}
              description={result.description}
              recommendedFertilizer={result.recommendedFertilizer}
              preventionTips={result.preventionTips}
            />
            <div className="text-center">
              <button 
                onClick={() => setResult(null)}
                className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-4"
              >
                {t('detect.analyzeAnother')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
