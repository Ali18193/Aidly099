import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  MessageSquare, 
  Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS } from '../../constants';

interface TestViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  testStep: number;
  setTestStep: (step: number) => void;
  testAnswers: number[];
  setTestAnswers: (answers: number[]) => void;
  testResult: string | null;
  setTestResult: (result: string | null) => void;
  isTestLoading: boolean;
  startTest: () => void;
  selectAnswer: (weight: number) => void;
  finishTest: () => void;
  setActiveTab: (tab: any) => void;
}

export const TestView: React.FC<TestViewProps> = ({
  theme,
  lang,
  t,
  testStep,
  setTestStep,
  testAnswers,
  setTestAnswers,
  testResult,
  setTestResult,
  isTestLoading,
  startTest,
  selectAnswer,
  finishTest,
  setActiveTab
}) => {

  const renderTestResult = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 space-y-8 text-center"
      >
        <div className="w-24 h-24 rounded-[40px] bg-teal-brand/10 text-teal-brand flex items-center justify-center mx-auto shadow-xl shadow-teal-brand/10">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black">{t("Nəticəniz Hazırdır", "Your Result is Ready")}</h2>
          <p className="text-sm font-medium opacity-70 leading-relaxed px-4">
            {testResult}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setActiveTab('sessions')}
            className="w-full py-5 rounded-3xl bg-teal-brand text-navy text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-brand/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <MessageSquare size={18} />
            {t("AI İlə Müzakirə Et", "Discuss with AI")}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
             <button
                onClick={startTest}
                className={`py-4 rounded-3xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-navy/5 border-navy/10'}`}
              >
                <RotateCcw size={14} />
                {t("Yenidən", "Retest")}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Aidly Test', text: testResult || '', url: window.location.href });
                  }
                }}
                className={`py-4 rounded-3xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-navy/5 border-navy/10'}`}
              >
                <Share2 size={14} />
                {t("Paylaş", "Share")}
              </button>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-black opacity-30 hover:opacity-100 transition-opacity uppercase tracking-widest"
        >
          {t("Ana səhifəyə qayıt", "Back to home")}
        </button>
      </motion.div>
    );
  };

  if (testResult) return renderTestResult();

  if (testStep === 0) {
    return (
      <div className="p-8 flex flex-col items-center text-center justify-center min-h-[70vh] space-y-10">
        <LogoWrapper size={100} />
        <div className="space-y-4 max-w-[280px]">
          <h2 className="text-2xl font-black tracking-tight leading-tight">
            {t("Mental Sağlamlıq Analizi", "Mental Health Analysis")}
          </h2>
          <p className="text-xs font-medium opacity-50 leading-relaxed">
            {t(
              "Bu qısa test hazırkı emosional vəziyyətinizi anlamağa və sizə uyğun tövsiyələr verməyə kömək edəcək.",
              "This short test will help understand your current emotional state and provide suitable recommendations."
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-3 w-full max-w-[240px]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-lg">⏱️</span>
            <span className="text-[10px] font-black opacity-60 text-left">{t("Cəmi 2 dəqiqə çəkir", "Takes only 2 minutes")}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-lg">🔒</span>
            <span className="text-[10px] font-black opacity-60 text-left">{t("Tamamilə anonimdir", "Completely anonymous")}</span>
          </div>
        </div>

        <button
          onClick={startTest}
          className="w-full max-w-[280px] py-6 rounded-[32px] bg-teal-brand text-navy text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-teal-brand/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {t("TESTƏ BAŞLA", "START TEST")}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[testStep - 1];
  const progress = (testStep / QUESTIONS.length) * 100;

  return (
    <div className="p-6 space-y-10 flex flex-col min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (testStep > 1) setTestStep(testStep - 1);
            else setTestStep(0);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform ${theme === 'dark' ? 'bg-white/5' : 'bg-navy/5'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 px-8">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              layoutId="progress"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-teal-brand shadow-[0_0_10px_rgba(0,212,200,0.5)]"
            />
          </div>
        </div>
        <span className="text-[10px] font-black opacity-40">{testStep} / {QUESTIONS.length}</span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center space-y-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={testStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10 text-center"
          >
            <h3 className="text-xl font-black tracking-tight leading-snug px-4">
              {t(currentQuestion.textAz, currentQuestion.textEn)}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.optionsAz.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => selectAnswer(currentQuestion.weights[idx])}
                  className={`p-5 rounded-3xl border text-sm font-bold transition-all active:scale-[0.98] text-center ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/5 hover:bg-teal-brand/10 hover:border-teal-brand/30'
                      : 'bg-navy/3 border-navy/5 hover:bg-teal-brand/10 hover:border-teal-brand/30'
                  }`}
                >
                  {t(opt, currentQuestion.optionsEn[idx])}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      {progress === 100 && (
         <button
            onClick={finishTest}
            disabled={isTestLoading}
            className="w-full py-6 rounded-[32px] bg-teal-brand text-navy text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-teal-brand/30 flex items-center justify-center gap-3 disabled:opacity-50"
         >
           {isTestLoading ? t("ANALİZ EDİLİR...", "ANALYZING...") : t("NƏTİCƏNİ GÖR", "SEE RESULT")}
           {!isTestLoading && <Sparkles size={18} />}
         </button>
      )}
    </div>
  );
};

const LogoWrapper = ({ size = 60 }: { size?: number }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <div className="absolute inset-0 bg-teal-brand/20 blur-2xl rounded-full" />
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="test_logo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4C8" />
          <stop offset="100%" stopColor="#00A89F" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="32" fill="url(#test_logo_grad)" />
      <path d="M50 30L65 50L50 70L35 50L50 30Z" fill="white" fillOpacity="0.8" />
    </svg>
  </div>
);

export default TestView;
