import React from 'react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface FeedbackViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setActiveTab: (tab: any) => void;
  feedbackType: 'positive' | 'negative' | null;
  setFeedbackType: (val: 'positive' | 'negative' | null) => void;
  feedbackText: string;
  setFeedbackText: (val: string) => void;
  isFeedbackSent: boolean;
  handleSendFeedback: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  theme,
  lang,
  t,
  setActiveTab,
  feedbackType,
  setFeedbackType,
  feedbackText,
  setFeedbackText,
  isFeedbackSent,
  handleSendFeedback
}) => {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-black tracking-tight">{t("Geri Bildirim", "Feedback")}</h2>
      </div>

      {!isFeedbackSent ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 rounded-[32px] glass glass-dark bg-white/5 border border-white/5 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("TƏƏSSÜRATINIZ", "YOUR IMPRESSION")}</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setFeedbackType('positive')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${feedbackType === 'positive' ? 'bg-teal-brand/20 border-teal-brand text-teal-brand' : 'bg-white/5 border-white/5 opacity-40'}`}
                >
                  <ThumbsUp size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t("Müsbət", "Positive")}</span>
                </button>
                <button 
                  onClick={() => setFeedbackType('negative')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${feedbackType === 'negative' ? 'bg-orange-brand/20 border-orange-brand text-orange-brand' : 'bg-white/5 border-white/5 opacity-40'}`}
                >
                  <ThumbsDown size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t("Mənfi", "Negative")}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("DƏVAMI (İSTƏYƏ BAĞLI)", "MORE DETAILS (OPTIONAL)")}</label>
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t("Fikirlərinizi bizimlə bölüşün...", "Share your thoughts with us...")}
                className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold focus:border-teal-brand/50 outline-none transition-all resize-none"
              />
            </div>

            <button 
              onClick={handleSendFeedback}
              disabled={!feedbackType}
              className="w-full py-5 rounded-2xl bg-teal-brand text-navy text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-teal-brand/30 disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
            >
               {t("GÖNDƏR", "SEND FEEDBACK")}
            </button>
          </div>
          
          <div className="p-6 rounded-[32px] bg-orange-brand/5 border border-orange-brand/10 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-orange-brand/10 text-orange-brand flex items-center justify-center shrink-0">
               <Sparkles size={24} />
             </div>
             <p className="text-[10px] font-bold opacity-60 leading-relaxed">
               {t("Sizin fikirləriniz Aidly-ni hər gün daha yaxşı etməyə kömək edir. Təşəkkür edirik!", "Your feedback helps make Aidly better every day. Thank you!")}
             </p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-20 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center mx-auto">
            <CheckCircle size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black">{t("Təşəkkür edirik!", "Thank you!")}</h3>
            <p className="text-xs font-bold opacity-40 px-10">{t("Geri bildiriminiz uğurla göndərildi.", "Your feedback has been successfully sent.")}</p>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className="px-8 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest"
          >
            {t("GERİ QAYIT", "GO BACK")}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FeedbackView;
