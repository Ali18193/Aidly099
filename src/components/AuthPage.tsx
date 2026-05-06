import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthPageProps {
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
  onAuthAction: (e: React.FormEvent, data: any) => void;
  error: string | null;
  lang: 'az' | 'en';
  isEmailVerified: boolean;
  userEmail: string | null;
  onResendVerification: () => void;
  onSignOut: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  authMode, 
  setAuthMode, 
  onAuthAction, 
  error, 
  lang,
  isEmailVerified,
  userEmail,
  onResendVerification,
  onSignOut
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = (az: string, en: string) => lang === 'az' ? az : en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAuthAction(e, { email, password });
    } finally {
      setIsLoading(false);
    }
  };

  if (userEmail && !isEmailVerified) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 text-white text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-teal-brand/20 rounded-full flex items-center justify-center text-teal-brand"
        >
          <Mail size={40} />
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black">{t("E-poçtunuzu təsdiqləyin", "Verify your email")}</h1>
          <p className="text-sm opacity-60 max-w-xs mx-auto">
            {t(`${userEmail} ünvanına təsdiq linki göndərildi. Zəhmət olmasa e-poçtunuzu yoxlayın.`, `A verification link has been sent to ${userEmail}. Please check your email.`)}
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <motion.div 
            className="p-4 bg-white/5 rounded-2xl flex items-center gap-3 text-xs font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <RefreshCw size={16} className="animate-spin" />
            {t("Təsdiqlənmə gözlənilir...", "Waiting for verification...")}
          </motion.div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-rose-400 text-[10px] font-bold bg-rose-400/10 p-3 rounded-xl border border-rose-400/20">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button 
            onClick={onResendVerification}
            className="text-teal-brand text-xs font-black uppercase tracking-widest py-2 hover:opacity-70 transition-opacity"
          >
            {t("TƏKRAR GÖNDƏR", "RESEND EMAIL")}
          </button>

          <button 
            onClick={onSignOut}
            className="text-white/40 text-[10px] font-bold uppercase tracking-widest py-2 hover:text-white transition-colors"
          >
            {t("GERİ QAYIT / ÇIXIŞ", "GO BACK / SIGN OUT")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col p-6 text-white">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-12">
        <div className="space-y-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-12 h-12 bg-teal-brand rounded-2xl flex items-center justify-center text-navy shadow-lg shadow-teal-brand/20"
          >
            <Lock size={24} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight leading-none italic">
            {authMode === 'login' ? t("Yenidən xoş gördük!", "Welcome back!") : 
             authMode === 'register' ? t("Hesab yaradın", "Create account") : 
             t("Şifrəni bərpa et", "Reset password")}
          </h1>
          <p className="text-sm opacity-50 font-medium">
            {authMode === 'login' ? t("Daxil olun və emosional dəstək alın", "Sign in to get emotional support") : 
             authMode === 'register' ? t("Aidly ailəsinə qoşulun", "Join the Aidly family") : 
             t("E-poçtunuzu daxil edin", "Enter your email")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input 
                type="email" 
                placeholder={t("E-poçt", "Email address")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-teal-brand transition-colors"
                disabled={isLoading}
              />
            </div>
            
            {authMode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="password" 
                  placeholder={t("Şifrə", "Password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-teal-brand transition-colors"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex items-center gap-2 text-rose-400 text-[10px] font-bold bg-rose-400/10 p-3 rounded-xl border border-rose-400/20"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-brand text-navy py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-teal-brand/20 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <>
                {authMode === 'login' ? t("DAXİL OL", "SIGN IN") : 
                 authMode === 'register' ? t("QEYDİYYATDAN KEÇ", "GET STARTED") : 
                 t("GÖNDƏR", "SEND LINK")}
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <div className="flex flex-col items-center gap-4">
          {authMode === 'login' ? (
            <>
              <button onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold opacity-40 hover:opacity-100 transition-opacity">
                {t("Şifrənizi unutmusunuz?", "Forgot your password?")}
              </button>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className="opacity-40">{t("Hesabınız yoxdur?", "Don't have an account?")}</span>
                <button onClick={() => setAuthMode('register')} className="text-teal-brand">
                  {t("Qeydiyyatdan keçin", "Create one now")}
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setAuthMode('login')} className="text-[10px] font-bold opacity-40 hover:opacity-100 transition-opacity">
              {t("Geri dön", "Go back to login")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
