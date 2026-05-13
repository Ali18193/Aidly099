import React from 'react';
import { 
  Heart, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  ListTodo, 
  ClipboardList, 
  UserCheck, 
  Building, 
  BookOpen 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../Logo';
import { UserProfile, MoodLog, Task } from '../../types';
import { QUOTES } from '../../constants';

interface HomeViewProps {
  user: any;
  userProfile: UserProfile | null;
  moodLogs: MoodLog[];
  tasks: Task[];
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setIsDailyModalOpen: (val: boolean) => void;
  setActiveTab: (tab: any) => void;
  handleMoodClick: (mood: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  userProfile,
  moodLogs,
  tasks,
  theme,
  lang,
  t,
  setIsDailyModalOpen,
  setActiveTab,
  handleMoodClick
}) => {
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <div className="p-5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* App Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter title-font">
          Aid<span className="text-orange-brand">ly</span>
        </h1>
        <Logo size={42} />
      </div>

      {/* Greeting */}
      <div className="space-y-1">
        <p className="text-xs font-bold opacity-30 flex items-center gap-1.5">{t("Xoş gəldiniz", "Welcome")} 👋</p>
        <h2 className="text-2xl font-black tracking-tight">
          {t(
            `Salam, ${userProfile?.name || user?.email?.split('@')[0]}`, 
            `Hello, ${userProfile?.name || user?.email?.split('@')[0]}`
          )}
        </h2>
      </div>

      {/* Mood Tracker Card */}
      <div className={`p-6 rounded-[40px] glass ${theme === 'dark' ? 'bg-white/5' : 'bg-navy/5'} border border-white/5 space-y-6`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-black tracking-tight">{t("Bu gün necə hiss edirsiniz?", "How do you feel today?")}</p>
          <button 
            onClick={() => setIsDailyModalOpen(true)}
            className="text-[10px] font-black uppercase text-teal-brand tracking-[0.2em]"
          >
            {t("Hamısı", "All")}
          </button>
        </div>
        <div className="flex justify-between items-center px-1">
          {['😊', '😐', '😔', '😰', '😡'].map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMoodClick(m)}
              className="text-4xl filter drop-shadow-md transition-all active:scale-90"
            >
              {m}
            </motion.button>
          ))}
        </div>
        
        {moodLogs.length > 0 && (
          <div className="pt-2 flex items-center justify-between opacity-40">
            <div className="flex gap-1.5">
              {moodLogs.map((log, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-brand" />
              ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest">{t("7 günlük statistika", "7 day streaks")}</p>
          </div>
        )}
      </div>

      {/* Daily Advice/Quote */}
      <div className="relative p-8 rounded-[40px] bg-orange-brand/10 border border-orange-brand/20 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-brand/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="w-10 h-10 rounded-full bg-orange-brand text-white flex items-center justify-center shadow-lg shadow-orange-brand/30">
            <Sparkles size={20} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-brand opacity-60">{t("Günün Tövsiyəsi", "Daily Wisdom")}</h3>
            <p className="text-sm font-black leading-relaxed italic">
              "{t(quote.az, quote.en)}"
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tasks Summary */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className={`p-6 rounded-[40px] glass ${theme === 'dark' ? 'bg-[#0E1521] border-white/5' : 'bg-white border-navy/5'} flex flex-col justify-between h-40 group cursor-pointer`}
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-brand/10 text-teal-brand flex items-center justify-center group-hover:scale-110 transition-transform">
            <ListTodo size={24} />
          </div>
          <div>
            <span className="text-2xl font-black">{tasks.filter(t => !t.completed).length}</span>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{t("Tapşırıq", "Tasks Left")}</p>
          </div>
        </div>

        {/* Therapy Session Count */}
        <div 
          onClick={() => setActiveTab('sessions')}
          className={`p-6 rounded-[40px] glass ${theme === 'dark' ? 'bg-[#0E1521] border-white/5' : 'bg-white border-navy/5'} flex flex-col justify-between h-40 group cursor-pointer`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart size={24} />
          </div>
          <div>
            <span className="text-2xl font-black">AI</span>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{t("Dəstək", "Support")}</p>
          </div>
        </div>
      </div>

      {/* Fast Actions */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("CƏLD GİRİŞLƏR", "QUICK ACTIONS")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: <ClipboardList size={22} />, label: t("Özünü qiymətləndir", "Self-assess"), color: "bg-orange-brand/10 text-orange-brand", onClick: () => setActiveTab('test') },
            { icon: <ListTodo size={22} />, label: t("Tapşırıqlar", "Tasks"), color: "bg-blue-500/10 text-blue-400", onClick: () => setActiveTab('tasks') },
            { icon: <UserCheck size={22} />, label: t("Psixoloq tap", "Find psychologist"), color: "bg-teal-brand/10 text-teal-brand", onClick: () => setActiveTab('sessions') },
            { icon: <Building size={22} />, label: t("Sosial xidmətlər", "Social services"), color: "bg-indigo-500/10 text-indigo-400", onClick: () => setActiveTab('social_services') },
            { icon: <BookOpen size={22} />, label: t("Resurslar", "Resources"), color: "bg-purple-500/10 text-purple-400", onClick: () => setActiveTab('resources') }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.onClick}
              className={`p-4 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'} border flex flex-col items-center justify-center gap-3 text-center cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black opacity-80 leading-tight">{item.label}</span>
            </motion.div>
          ))}
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('past_chats')}
            className={`p-4 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'} border flex flex-col items-center justify-center gap-3 text-center cursor-pointer`}
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
               <ArrowRight size={22} />
            </div>
            <span className="text-[10px] font-black opacity-80 leading-tight">{t("Söhbət Tarixçəsi", "Chat History")}</span>
          </motion.div>
        </div>
      </div>

      {/* Emergency Section */}
      <div 
        onClick={() => setActiveTab('social_services')}
        className={`p-6 rounded-[40px] bg-red-500/10 border border-red-500/5 flex items-center justify-between group cursor-pointer`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center">
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="text-sm font-black text-red-400">{t("Təcili Yardıma ehtiyacınız var?", "Need urgent help?")}.</h4>
            <p className="text-[10px] font-bold opacity-40">{t("7/24 Dəstək Xətləri", "24/7 Support Lines")}</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:translate-x-1 transition-transform">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
