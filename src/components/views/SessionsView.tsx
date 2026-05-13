import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';
import { ChatSession } from '../../types';
import { PSYCHOLOGISTS, REAL_PSYCHOLOGISTS } from '../../constants';

interface SessionsViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setActiveTab: (tab: any) => void;
  sessions: ChatSession[];
  allChats: Record<string, any[]>;
  startChat: (id: string) => void;
  removeSession: (id: string) => void;
  addSession: (p: any) => void;
  homeCategory: 'ai' | 'real';
  setHomeCategory: (cat: 'ai' | 'real') => void;
  psychSearch: string;
  setPsychSearch: (val: string) => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  theme,
  lang,
  t,
  setActiveTab,
  sessions,
  allChats,
  startChat,
  removeSession,
  addSession,
  homeCategory,
  setHomeCategory,
  psychSearch,
  setPsychSearch
}) => {
  const listToFilter = homeCategory === 'ai' ? PSYCHOLOGISTS : REAL_PSYCHOLOGISTS;
  const filteredPsychs = listToFilter.filter(p => {
    const search = psychSearch.toLowerCase();
    const name = (lang === 'az' ? p.nameAz : p.nameEn).toLowerCase();
    const specialty = (lang === 'az' ? p.specialtyAz : p.specialtyEn).toLowerCase();
    return name.includes(search) || specialty.includes(search);
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className={`px-5 py-4 flex items-center gap-3 sticky top-0 backdrop-blur-xl z-50 border-b ${theme === 'dark' ? 'bg-[#0A0C10]/95 border-white/5' : 'bg-white/95 border-navy/5'}`}>
        <button 
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1">{t("Psixoloqlar", "Psychologists")}</h2>
      </div>

      <div className="flex-1 p-5 space-y-8 pb-32">
        {/* Active Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("AKTİV ÇATLAR", "ACTIVE CHATS")}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {sessions.map(s => {
                const chatHistory = allChats[s.id] || [];
                const lastMsg = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";
                const truncatedMsg = lastMsg.length > 12 ? lastMsg.substring(0, 12) + "..." : lastMsg;
                
                return (
                  <div key={s.id} className="relative group shrink-0 flex flex-col items-center gap-2">
                    <div 
                      onClick={() => startChat(s.id)}
                      className="w-16 h-16 rounded-full ring-2 ring-teal-brand/30 p-1 cursor-pointer transform active:scale-95 transition-all"
                    >
                      <img src={s.avatar} alt={s.nameAz} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-0 right-0 w-4 h-4 bg-teal-brand rounded-full border-2 border-navy animate-pulse" />
                    </div>
                    <button 
                      onClick={() => removeSession(s.id)}
                      className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-navy scale-0 group-hover:scale-100 transition-transform z-10"
                    >
                      <X size={12} />
                    </button>
                    <div className="text-center w-16">
                      <p className="text-[9px] font-black opacity-80 truncate">{lang === 'az' ? s.nameAz.split(' ')[s.nameAz.split(' ').length - 1] : s.nameEn.split(' ')[s.nameEn.split(' ').length - 1]}</p>
                      {lastMsg && <p className="text-[7px] font-bold opacity-30 mt-0.5 truncate">{truncatedMsg}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Directory Toggle */}
        <div className={`flex p-1.5 rounded-2xl border relative ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'}`}>
          <button 
            onClick={() => { setHomeCategory('ai'); setPsychSearch(''); }}
            className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all z-10 ${homeCategory === 'ai' ? 'text-navy' : (theme === 'dark' ? 'text-white/40' : 'text-navy/40')}`}
          >
            {t("🤖 AI DOSTLAR", "🤖 AI BUDDIES")}
          </button>
          <button 
            onClick={() => { setHomeCategory('real'); setPsychSearch(''); }}
            className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all z-10 ${homeCategory === 'real' ? 'text-navy' : (theme === 'dark' ? 'text-white/40' : 'text-navy/40')}`}
          >
            {t("👨‍⚕️ REAL MÜTƏXƏSSİS", "👨‍⚕️ REAL DOCS")}
          </button>
          <motion.div
            layout
            layoutId="categoryHighlight"
            className="absolute inset-y-1.5 bg-teal-brand rounded-xl shadow-lg"
            initial={false}
            animate={{
              left: homeCategory === 'ai' ? "6px" : "50%",
              width: "calc(50% - 6px)"
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/20' : 'text-navy/20'}`} size={16} />
          <input 
            type="text"
            value={psychSearch}
            onChange={(e) => setPsychSearch(e.target.value)}
            placeholder={t("Ad və ya ixtisas üzrə axtar...", "Search by name or specialty...")}
            className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-teal-brand/50 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-transparent border-navy/10'}`}
          />
        </div>

        {/* Psychologist List */}
        <div className="grid gap-4">
          {filteredPsychs.length > 0 ? (
            filteredPsychs.map((p: any) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-[32px] border flex items-center gap-4 hover:border-teal-brand/20 transition-colors group ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'}`}
              >
                <div className="relative">
                  <img src={p.avatar} alt={p.nameAz} className="w-16 h-16 rounded-3xl object-cover ring-1 ring-white/10 shadow-xl" referrerPolicy="no-referrer" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1117] ${homeCategory === 'ai' ? 'bg-teal-brand' : 'bg-orange-brand'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[13px] font-black truncate group-hover:text-teal-brand transition-colors">{lang === 'az' ? p.nameAz : p.nameEn}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] font-bold opacity-40 truncate">{lang === 'az' ? p.specialtyAz : p.specialtyEn}</p>
                      </div>
                      <p className="text-[9px] font-black text-teal-brand mt-1 flex items-center gap-1.5">
                        <span className="text-orange-brand">⭐ {p.rating}</span>
                        <span className="opacity-40">•</span>
                        <span className="opacity-50">
                          {homeCategory === 'ai' 
                            ? t(`${p.chatCount} söhbət`, `${p.chatCount} chats`) 
                            : t(`${p.sessionCount} qəbul`, `${p.sessionCount} sessions`)}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      {homeCategory === 'ai' ? (
                        <button 
                          onClick={() => {
                            addSession(p);
                            startChat(p.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-teal-brand text-navy text-[10px] font-black shadow-lg shadow-teal-brand/20 active:scale-95 transition-transform uppercase tracking-wider"
                        >
                          {t("Söhbətə Başla", "Start Chat")}
                        </button>
                      ) : (
                        <button 
                          onClick={() => window.open('https://iticket.az', '_blank')}
                          className="px-4 py-2 rounded-xl bg-orange-brand text-white text-[10px] font-black shadow-lg shadow-orange-brand/20 active:scale-95 transition-transform uppercase tracking-wider"
                        >
                          {t("Qəbula Yazıl", "Book Session")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
              <Search size={48} />
              <p className="text-xs font-black">{t("Psixoloq tapılmadı", "No psychologist found")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsView;
