import React from 'react';
import { 
  ArrowLeft, 
  MessageCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface PastChatsViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setActiveTab: (tab: any) => void;
  pastChats: any[];
}

export const PastChatsView: React.FC<PastChatsViewProps> = ({
  theme,
  lang,
  t,
  setActiveTab,
  pastChats
}) => {
  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className={`px-5 py-4 flex items-center gap-3 sticky top-0 backdrop-blur-xl z-50 border-b ${theme === 'dark' ? 'bg-[#0A0C10]/95 border-white/5' : 'bg-white/95 border-navy/5'}`}>
        <button 
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-sm font-black tracking-tighter">{t("Keçmiş Söhbətlər", "Past Chats")}</h2>
          <p className="text-[10px] font-bold opacity-40">{pastChats.length} {t("söhbət", "chats")}</p>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-4">
        {pastChats.length > 0 ? (
          pastChats.map(session => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-3xl border flex flex-col gap-3 group ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-teal-brand/30' : 'bg-navy/5 border-navy/5 hover:border-teal-brand/30'} transition-all`}
            >
              <div className="flex items-center gap-3">
                <img src={session.avatar} alt={session.psychNameAz} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h4 className="text-xs font-black">{lang === 'az' ? session.psychNameAz : session.psychNameEn}</h4>
                  <p className="text-[9px] font-bold opacity-50">{session.date} • {session.time}</p>
                </div>
                <div className="text-[10px] font-black text-teal-brand bg-teal-brand/10 px-2 py-1 rounded-lg">
                  {session.messages.length} {t("mesaj", "messages")}
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#0D1117] border border-white/5' : 'bg-white border border-navy/5'} text-[10px] font-bold opacity-70 italic line-clamp-2`}>
                "{session.messages.length > 1 ? session.messages[session.messages.length - 1].content : "..."}"
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 opacity-30 mt-10">
            <MessageCircle size={48} className="mx-auto mb-4" />
            <p className="text-sm font-black">{t("Söhbət tarixçəsi yoxdur", "No chat history")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastChatsView;
