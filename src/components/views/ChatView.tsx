import React, { useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PSYCHOLOGISTS } from '../../constants';

interface ChatViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  chatMessages: any[];
  inputText: string;
  setInputText: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isTyping: boolean;
  isAiVoiceEnabled: boolean;
  setIsAiVoiceEnabled: (val: boolean) => void;
  activeChatPsych: string | null;
  startChat: (id: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  handleCloseChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  theme,
  lang,
  t,
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  inputText,
  setInputText,
  handleSendMessage,
  isTyping,
  isAiVoiceEnabled,
  setIsAiVoiceEnabled,
  activeChatPsych,
  startChat,
  chatEndRef,
  handleCloseChat
}) => {

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-md p-2"
        >
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className={`w-full h-[92%] rounded-t-[32px] flex flex-col shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A0C10]' : 'bg-white'}`}
          >
            {/* Chat Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${theme === 'dark' ? 'bg-[#0A0C10] border-white/5' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-yellow-400/20 text-yellow-500' : 'bg-yellow-400/10 text-yellow-600'}`}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-navy'}`}>{t("Aidly AI Köməkçisi", "Aidly AI Assistant")}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const newState = !isAiVoiceEnabled;
                    setIsAiVoiceEnabled(newState);
                    localStorage.setItem('aidly_voice_enabled', String(newState));
                    if (!newState) window.speechSynthesis.cancel();
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAiVoiceEnabled ? 'bg-teal-brand/10 text-teal-brand' : theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'}`}
                >
                  {isAiVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button 
                  onClick={handleCloseChat}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 text-gray-500 hover:bg-white/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className={`flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide ${theme === 'dark' ? 'bg-[#0A0C10]' : 'bg-[#F8FAFF]'}`}>
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'model' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 ${theme === 'dark' ? 'bg-yellow-400/20 text-yellow-500' : 'bg-yellow-400/10 text-yellow-600'}`}>
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className={`max-w-[85%] space-y-3`}>
                    <div className={`p-4 text-xs font-bold leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? theme === 'dark' ? 'bg-white/10 text-white rounded-3xl rounded-tr-sm' : 'bg-[#E9ECEF] text-navy rounded-3xl rounded-tr-sm' 
                        : activeChatPsych === '4' && idx === chatMessages.length - 1 && msg.content.includes("tələbə yoldaşın")
                          ? 'bg-[#FFD95A] text-navy rounded-3xl rounded-tl-sm'
                          : theme === 'dark' ? 'bg-[#1A1D23] text-white rounded-3xl rounded-tl-sm border border-white/5' : 'bg-white text-navy rounded-3xl rounded-tl-sm'
                    }`}>
                      {msg.content}
                      
                      {/* Specialty Options */}
                      {msg.role === 'model' && idx === 0 && !activeChatPsych && (
                        <div className="mt-4 space-y-2">
                          {PSYCHOLOGISTS.map(p => (
                            <button
                              key={p.id}
                              onClick={() => startChat(p.id)}
                              className={`w-full flex items-center gap-3 p-2 pr-4 rounded-full transition-all active:scale-95 text-left border ${
                                theme === 'dark' ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'
                              } ${
                                p.id === '2' ? 'bg-blue-100/10 text-blue-400' : 
                                p.id === '3' ? 'bg-emerald-100/10 text-emerald-400' :
                                'bg-yellow-100/10 text-yellow-400'
                              }`}
                            >
                              <img src={p.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                              <span className="text-[10px] font-black">{lang === 'az' ? `${p.specialtyAz} (${p.shortNameAz})` : `${p.specialtyEn} (${p.shortNameEn})`}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {msg.detectedEmotion && (
                        <div className={`mt-2 pt-2 border-t text-[8px] font-black uppercase tracking-widest ${
                          msg.detectedEmotion === 'crisis' 
                            ? 'text-red-500 border-red-500/10 animate-pulse' 
                            : theme === 'dark' ? 'border-white/5 opacity-50' : 'border-black/5 opacity-50'
                        }`}>
                          {t("Hiss olunan", "Detected")}: {msg.detectedEmotion}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-yellow-400/20 text-yellow-500' : 'bg-yellow-400/10 text-yellow-600'}`}>
                    <Sparkles size={14} />
                  </div>
                  <div className={`p-4 px-6 rounded-3xl flex items-center gap-2 shadow-sm ${theme === 'dark' ? 'bg-[#1A1D23] border border-white/5' : 'bg-white'}`}>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className={`p-4 pb-8 border-t flex items-center gap-2 ${theme === 'dark' ? 'bg-[#0A0C10] border-white/5' : 'bg-white border-gray-100'}`}>
               <button 
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform ${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'}`}
               >
                  <Mic size={18} />
               </button>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t("Mesaj yazın...", "Type a message...")}
                  className={`w-full py-3.5 pr-12 pl-5 rounded-full text-xs font-bold outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-yellow-400' : 'bg-gray-50 border border-gray-100 focus:bg-white focus:border-yellow-400'}`}
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className={`absolute right-1 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all ${inputText.trim() ? 'bg-yellow-400 text-navy shadow-lg' : theme === 'dark' ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-300'}`}
                >
                  <svg viewBox="0 0 24 24" size={16} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatView;
