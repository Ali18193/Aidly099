import React from 'react';
import { 
  User, 
  Moon, 
  Sun, 
  Globe, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  MessageSquare, 
  Trash2, 
  LogOut, 
  ChevronRight, 
  ArrowLeft,
  Lock,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { User as FirebaseUser, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAnonymousUser: boolean;
  isVerifiedUser: boolean;
  isAiVoiceEnabled: boolean;
  emotionSensitivity: 'Low' | 'Medium' | 'High';
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setTheme: (val: 'dark' | 'light') => void;
  toggleLang: () => void;
  setIsAiVoiceEnabled: (val: boolean) => void;
  setEmotionSensitivity: (val: 'Low' | 'Medium' | 'High') => void;
  handleSignOut: () => void;
  setActiveTab: (tab: any) => void;
  setShowDeleteModal: (val: boolean) => void;
  handleResendVerification: () => void;
  setIsProfileComplete: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  userProfile,
  isAnonymousUser,
  isVerifiedUser,
  isAiVoiceEnabled,
  emotionSensitivity,
  theme,
  lang,
  t,
  setTheme,
  toggleLang,
  setIsAiVoiceEnabled,
  setEmotionSensitivity,
  handleSignOut,
  setActiveTab,
  setShowDeleteModal,
  handleResendVerification,
  setIsProfileComplete
}) => {

  const handleLinkAccount = async () => {
    if (!auth.currentUser) return;
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(auth.currentUser, provider);
      alert(t("Hesab uğurla əlaqələndirildi!", "Account linked successfully!"));
      window.location.reload();
    } catch (error: any) {
      console.error("Linking error:", error);
      alert(t("Əlaqələndirmə zamanı xəta oldu: ", "Error during linking: ") + error.message);
    }
  };

  return (
    <div className="p-4 space-y-6 relative pb-24">
      {/* Profil Başlığı */}
      <div className={`p-8 rounded-[40px] glass ${theme === 'dark' ? 'bg-[#0E1521] border-white/5' : 'bg-white border-navy/5'} border flex flex-col items-center text-center space-y-4 shadow-xl`}>
        <div className="relative">
          <div className="w-24 h-24 rounded-[32px] bg-teal-brand/10 flex items-center justify-center text-teal-brand ring-4 ring-teal-brand/5 shadow-inner">
            <User size={48} />
          </div>
          {isVerifiedUser && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal-brand text-navy flex items-center justify-center border-4 border-[#0E1521] shadow-lg">
              <Sparkles size={14} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight">{userProfile?.name || t("Adsız İstifadəçi", "Anonymous User")}</h3>
          <p className="text-xs font-bold opacity-30 mt-1">{user?.email || t("Anonim giriş", "Anonymous Login")}</p>
        </div>
        
        {isAnonymousUser && (
          <button 
            onClick={handleLinkAccount}
            className="w-full py-3 rounded-2xl bg-teal-brand/10 text-teal-brand text-[10px] font-black uppercase tracking-widest border border-teal-brand/20 hover:bg-teal-brand hover:text-navy transition-all animate-pulse"
          >
             {t("Hesabı Google ilə bağla 🔗", "Link Account with Google 🔗")}
          </button>
        )}

        <button 
          onClick={() => setIsProfileComplete(false)}
          className="px-6 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          {t("Profili Yenilə", "Edit Profile")}
        </button>
      </div>

      {!isVerifiedUser && !isAnonymousUser && (
        <div className="p-5 rounded-[32px] bg-red-400/10 border border-red-400/20 space-y-3">
          <div className="flex items-center gap-3 text-red-400">
            <ShieldAlert size={20} />
            <h4 className="text-xs font-black">{t("E-poçt təsdiqlənməyib", "Email not verified")}</h4>
          </div>
          <p className="text-[10px] font-bold opacity-60">{t("Məlumatlarınızın təhlükəsizliyi üçün e-poçtunuzu təsdiqləyin.", "Verify your email for data security.")}</p>
          <button onClick={handleResendVerification} className="text-[10px] font-black text-red-400 uppercase tracking-widest underline decoration-2 underline-offset-4">{t("Təkrar göndər", "Resend link")}</button>
        </div>
      )}

      {/* Parametrlər Qrupu */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-3">{t("TƏTBİQ AYARLARI", "APP SETTINGS")}</h4>
        
        <div className={`rounded-[32px] overflow-hidden border ${theme === 'dark' ? 'bg-[#0E1521] border-white/5' : 'bg-white border-navy/5'} divide-y divide-white/5`}>
          {/* Theme Toggle */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-orange-brand/10 text-orange-brand' : 'bg-blue-500/10 text-blue-400'}`}>
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span className="text-sm font-bold">{t("Qara rejim", "Dark Mode")}</span>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-teal-brand' : 'bg-navy/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Language Toggle */}
          <div 
            onClick={toggleLang}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Globe size={18} />
              </div>
              <span className="text-sm font-bold">{t("Dil", "Language")}</span>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-teal-brand">{lang === 'az' ? 'Azərbaycanca' : 'English'}</span>
          </div>

          {/* AI Voice Toggle */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-brand/10 text-teal-brand flex items-center justify-center">
                {isAiVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </div>
              <span className="text-sm font-bold">{t("Səsli cavab", "AI Voice")}</span>
            </div>
            <button 
              onClick={() => {
                const newVal = !isAiVoiceEnabled;
                setIsAiVoiceEnabled(newVal);
                localStorage.setItem('aidly_voice_enabled', String(newVal));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${isAiVoiceEnabled ? 'bg-teal-brand' : 'bg-navy/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isAiVoiceEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Emotion Sensitivity */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-400/10 text-red-400 flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                <span className="text-sm font-bold">{t("Həssaslıq", "Sensitivity")}</span>
              </div>
              <span className="text-xs font-black text-teal-brand">{emotionSensitivity}</span>
            </div>
            <div className="flex gap-2 p-1 rounded-2xl bg-navy/20">
              {['Low', 'Medium', 'High'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setEmotionSensitivity(s as any);
                    localStorage.setItem('aidly_emotion_sensitivity', s);
                  }}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${emotionSensitivity === s ? 'bg-teal-brand text-navy shadow-lg shadow-teal-brand/20' : 'opacity-40'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Digər Bölmələr */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-3">{t("DAHA ÇOX", "MORE")}</h4>
        <div className={`rounded-[32px] overflow-hidden border ${theme === 'dark' ? 'bg-[#0E1521] border-white/5' : 'bg-white border-navy/5'} divide-y divide-white/5`}>
          <div 
             onClick={() => setActiveTab('feedback')}
             className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-brand/10 text-orange-brand flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <span className="text-sm font-bold">{t("Geri bildirim", "Feedback")}</span>
            </div>
            <ChevronRight size={16} className="opacity-30" />
          </div>

          <div 
             onClick={() => setActiveTab('past_chats')}
             className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <span className="text-sm font-bold">{t("Söhbət Arxivim", "Chat Archive")}</span>
            </div>
            <ChevronRight size={16} className="opacity-30" />
          </div>

          <div 
            onClick={() => setShowDeleteModal(true)}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-red-500/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-400/10 text-red-400 flex items-center justify-center group-hover:bg-red-400 group-hover:text-white transition-all">
                <Trash2 size={18} />
              </div>
              <span className="text-sm font-bold text-red-400">{t("Hesabı sil", "Delete Account")}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSignOut}
        className="w-full py-5 rounded-[32px] bg-white/5 border border-white/5 text-red-400 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
      >
        <LogOut size={18} />
        {t("ÇIXIŞ ET", "LOG OUT")}
      </button>

      <div className="text-center py-6 opacity-20">
        <p className="text-[10px] font-black uppercase tracking-widest">Aidly v1.5.0</p>
        <p className="text-[9px] font-bold mt-1">Made with AI for Humanity</p>
      </div>
    </div>
  );
};

export default SettingsView;
