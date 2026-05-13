import React from 'react';
import { 
  Trash2 
} from 'lucide-react';
import { TestResult } from '../../types';

interface ResultsViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  testResults: TestResult[];
  clearAllResults: () => void;
  removeResult: (id: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  theme,
  lang,
  t,
  testResults,
  clearAllResults,
  removeResult
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[14px] font-black uppercase tracking-widest text-teal-brand leading-none">{t("Test Nəticələri", "Test Results")}</h2>
        {testResults.length > 0 && (
          <button 
            onClick={clearAllResults}
            className="text-[10px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            {t("Hamısını Sil", "Clear All")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testResults.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl glass ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>📊</div>
            <p className="text-xs opacity-50 font-bold">{t("Hələ ki heç bir test nəticəsi yoxdur.", "No test results yet.")}</p>
          </div>
        ) : (
          testResults.map(res => (
            <div key={res.id} className={`rounded-3xl overflow-hidden glass ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
              <div className="p-4 flex items-center justify-between border-b border-navy/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-4 ${res.score > 75 ? 'border-teal-brand/40 text-teal-brand' : res.score > 45 ? 'border-orange-brand/40 text-orange-brand' : 'border-red-500/40 text-red-500'} flex items-center justify-center font-black text-xs shadow-inner`}>
                    {res.score}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-none mb-1">{res.mood} {t("Psixoloji Vəziyyət", "Psychological State")}</h4>
                    <p className="text-[10px] opacity-40 font-bold tracking-tight">{res.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeResult(res.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-red-500/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4 relative">
                <div className="mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-brand leading-none">{t("AIDLY MƏSLƏHƏTİ", "AIDLY ADVICE")}</span>
                </div>
                <p className={`text-[11px] leading-relaxed font-bold italic tracking-tight ${theme === 'light' ? 'text-navy' : 'text-white'}`}>
                  {res.advice}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultsView;
