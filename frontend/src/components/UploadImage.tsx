import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UploadImageProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

export default function UploadImage({ onAnalyze, isLoading }: UploadImageProps) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t('detect.imageOnly'));
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
          dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="max-h-64 rounded-xl shadow-md" />
            <button 
              onClick={clearFile}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{t('detect.upload')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('detect.fileTypes')}</p>
            </div>
            <button 
              onClick={() => inputRef.current?.click()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {t('detect.selectFile')}
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onAnalyze(file)}
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
              isLoading 
                ? 'bg-emerald-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('detect.analyzing')}
              </span>
            ) : t('detect.analyzeBtn')}
          </button>
        </div>
      )}
    </div>
  );
}
