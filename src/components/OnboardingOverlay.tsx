import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, User, Heart, ChevronRight } from 'lucide-react';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  healthStatus: string;
}

interface OnboardingOverlayProps {
  onComplete: (profile: UserProfile) => void;
  lang: 'az' | 'en';
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onComplete, lang }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: '',
    healthStatus: ''
  });

  const t = (az: string, en: string) => lang === 'az' ? az : en;

  const ageNum = parseInt(profile.age);
  const isAgeValid = !isNaN(ageNum) && ageNum >= 5 && ageNum <= 120;
  
  const isComplete = profile.name.trim() !== '' && profile.age.trim() !== '' && isAgeValid && profile.gender !== '' && profile.healthStatus.trim() !== '';

  const handleSubmit = () => {
    if (isComplete) {
      onComplete(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-sm max-h-[90vh] bg-[#0E1521] border border-white/10 rounded-[32px] p-6 shadow-2xl overflow-y-auto custom-scrollbar"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles size={100} />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-black tracking-tight text-white">
              {t("Aidly-yə Xoş Gəldiniz! 🌿", "Welcome to Aidly! 🌿")}
            </h2>
            <p className="text-[11px] font-medium text-white/50 leading-relaxed px-2">
              {t(
                "Sizə ən doğru emosional dəstəyi göstərə bilməyimiz üçün aşağıdakı məlumatları qeyd etməyiniz mütləqdir.", 
                "To provide you with the most accurate emotional support, please provide the following details."
              )}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                {t("Adınız", "Your Name")}
              </label>
              <input 
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t("Məs: Orxan", "E.g.: Orkhan")}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white font-bold outline-none focus:border-teal-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                  {t("Yaşınız", "Your Age")}
                </label>
                {profile.age.trim() !== '' && !isAgeValid && (
                  <span className="text-[8px] text-rose-400 font-bold">
                    {t("Düzgün yaş daxil edin (5-120)", "Enter valid age (5-120)")}
                  </span>
                )}
              </div>
              <input 
                type="number"
                inputMode="numeric"
                min="5"
                max="120"
                value={profile.age}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 3) {
                    const num = parseInt(val);
                    if (val === '' || (num >= 0 && num <= 120)) {
                      setProfile(prev => ({ ...prev, age: val }));
                    }
                  }
                }}
                placeholder={t("Məs: 25", "E.g.: 25")}
                className={`w-full h-12 bg-white/5 border rounded-xl px-4 text-sm text-white font-bold outline-none transition-colors ${profile.age.trim() !== '' && !isAgeValid ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-teal-brand'}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                {t("Cinsiniz", "Your Gender")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'male', az: 'Kişi', en: 'Male' },
                  { id: 'female', az: 'Qadın', en: 'Female' },
                  { id: 'other', az: 'Digər', en: 'Other' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setProfile(prev => ({ ...prev, gender: g.id }))}
                    className={`h-11 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all ${profile.gender === g.id ? 'bg-teal-brand border-teal-brand text-navy' : 'bg-white/5 border-white/5 text-white/60'}`}
                  >
                    {t(g.az, g.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                {t("Sağlamlıq Vəziyyətiniz", "Your Health Status")}
              </label>
              <textarea 
                value={profile.healthStatus}
                onChange={(e) => setProfile(prev => ({ ...prev, healthStatus: e.target.value }))}
                placeholder={t("Məs: Xroniki xəstəlik, depressiya...", "E.g.: Chronic disease, depression...")}
                className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-4 text-[11px] font-bold outline-none focus:border-teal-brand transition-colors resize-none mb-1"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${isComplete ? 'bg-teal-brand text-navy shadow-lg shadow-teal-brand/20 active:scale-95' : 'bg-white/5 text-white/20'}`}
          >
            <Sparkles size={14} />
            {t("Funksiyaları Aktivləşdir", "Activate Functions")}
            <ChevronRight size={14} />
          </button>
          
          <p className="text-[8px] text-center text-white/20 font-bold leading-tight pb-2">
            {t("Məlumatlar daxil edilmədən tətbiqin funksiyaları aktivləşməyəcək.", "App functions will not activate without entering this information.")}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
