/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Heart, 
  Settings, 
  ClipboardList, 
  MessageCircle, 
  Home, 
  Trash2, 
  Moon, 
  Sun, 
  Send, 
  ChevronRight, 
  X,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Mic,
  MicOff,
  Calendar,
  Clock,
  UserCheck,
  Wifi,
  Battery,
  ArrowLeft,
  Search,
  Building,
  MapPin,
  Phone,
  AlertCircle,
  Info,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Book,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAIAdvice, getAICounseling } from './lib/gemini';

// Types
interface Session {
  id: string;
  nameAz: string;
  nameEn: string;
  specialtyAz: string;
  specialtyEn: string;
  avatar: string;
}

interface Booking {
  id: string;
  psychId: string;
  psychNameAz: string;
  psychNameEn: string;
  specialtyAz: string;
  specialtyEn: string;
  avatar: string;
  time: string;
  date: string;
}

interface TestResult {
  id: string;
  date: string;
  score: number;
  advice: string;
  mood: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  feedback?: 'positive' | 'negative' | null;
  feedbackComment?: string;
  detectedEmotion?: string;
}

const PSYCHOLOGISTS = [
  { id: '2', nameAz: 'Dr. Samir Qasımov', nameEn: 'Dr. Samir Gasimov', specialtyAz: 'Təşviş və Stress', specialtyEn: 'Anxiety and Stress', avatar: 'https://picsum.photos/seed/samir/100/100' },
  { id: '3', nameAz: 'Dr. Günel Sadıqova', nameEn: 'Dr. Gunel Sadiqova', specialtyAz: 'Uşaq Psixoloqu', specialtyEn: 'Child Psychologist', avatar: 'https://picsum.photos/seed/gunel/100/100' },
  { id: '4', nameAz: 'Aydan (Tələbə Dostu)', nameEn: 'Aydan (Student Buddy)', specialtyAz: 'Tələbə və məktəblilər üçün', specialtyEn: 'For Students and Pupils', avatar: 'https://picsum.photos/seed/student/100/100' },
];

const REAL_PSYCHOLOGISTS = [
  { id: 'r1', nameAz: 'Dr. Orxan Məmmədov', nameEn: 'Dr. Orkhan Mammadov', specialtyAz: 'Psixoterapevt', specialtyEn: 'Psychotherapist', avatar: 'https://picsum.photos/seed/orxan/100/100' },
  { id: 'r2', nameAz: 'Dr. Nigar Rzayeva', nameEn: 'Dr. Nigar Rzayeva', specialtyAz: 'Ailə Psixoloqu', specialtyEn: 'Family Psychologist', avatar: 'https://picsum.photos/seed/nigar/100/100' },
];

const QUESTIONS = [
  { 
    id: 1, 
    textAz: "Son günlərdə özünüzü necə hiss edirsiniz?", 
    textEn: "How have you been feeling lately?",
    optionsAz: ["Çox gərgin", "Biraz narahat", "Normal", "Çox yaxşı"], 
    optionsEn: ["Very tense", "A bit anxious", "Normal", "Very good"],
    weights: [0, 33, 66, 100] 
  },
  { 
    id: 2, 
    textAz: "Yuxu rejiminizdə dəyişiklik varmı?", 
    textEn: "Is there a change in your sleep cycle?",
    optionsAz: ["Bəli, çox pozulub", "Biraz pozulub", "Xeyr, hər şey qaydasındadır"], 
    optionsEn: ["Yes, very disturbed", "A bit disturbed", "No, everything is fine"],
    weights: [0, 50, 100] 
  },
  { 
    id: 3, 
    textAz: "Gələcəyə ümidlə baxırsınız?", 
    textEn: "Do you look forward to the future with hope?",
    optionsAz: ["Qətiyyən yox", "Bəzən", "Bəli, həmişə"], 
    optionsEn: ["Not at all", "Sometimes", "Yes, always"],
    weights: [0, 50, 100] 
  },
  {
    id: 4,
    textAz: "İştahınızda hər hansı bir dəyişiklik hiss edirsiniz?",
    textEn: "Do you notice any changes in your appetite?",
    optionsAz: ["Çox azalıb/artıb", "Bir az dəyişib", "Xeyr, eynidir"],
    optionsEn: ["Decreased/Increased significantly", "Changed a bit", "No, it is the same"],
    weights: [0, 50, 100]
  },
  {
    id: 5,
    textAz: "Gündəlik işlərinizə marağınız nə dərəcədədir?",
    textEn: "How is your interest in daily activities?",
    optionsAz: ["Heç yoxdur", "Azalıb", "Normaldır"],
    optionsEn: ["None at all", "Decreased", "Normal"],
    weights: [0, 50, 100]
  }
];

const Logo = ({ className, size = 40 }: { className?: string, size?: number }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="logo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4C8" />
          <stop offset="100%" stopColor="#00A89F" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="28" fill="url(#logo_grad)" />
      {/* Brain Outline Simplified */}
      <path d="M50 25C35 25 25 35 25 50C25 65 35 75 50 75C65 75 75 65 75 50C75 35 65 25 50 25Z" fill="white" fillOpacity="0.1" />
      {/* Heart integrated inside */}
      <path d="M50 42C50 42 47 38 42 38C37 38 34 42 34 47C34 55 50 65 50 65C50 65 66 55 66 47C66 42 63 38 58 38C53 38 50 42 50 42Z" fill="white" fillOpacity="0.3" />
      {/* Neural nodes/dots */}
      <circle cx="35" cy="40" r="2" fill="white" />
      <circle cx="65" cy="40" r="2" fill="white" />
      <circle cx="50" cy="50" r="3" fill="white" />
      <path d="M35 40L50 50L65 40" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  </div>
);

export default function App() {
  const [lang, setLang] = useState<'az' | 'en'>('az');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'home' | 'test' | 'results' | 'sessions' | 'settings' | 'social_services' | 'resources'>('home');
  const [isAppOn, setIsAppOn] = useState(false);
  const [showScore, setShowScore] = useState<number | null>(null);
  const [homeCategory, setHomeCategory] = useState<'ai' | 'real'>('ai');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPsychForBooking, setSelectedPsychForBooking] = useState<typeof REAL_PSYCHOLOGISTS[0] | null>(null);
  
  // App States
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTestAnswers, setCurrentTestAnswers] = useState<number[]>([]);
  const [testStep, setTestStep] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [tempAdvice, setTempAdvice] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatPsych, setActiveChatPsych] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [allChats, setAllChats] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAiVoiceEnabled, setIsAiVoiceEnabled] = useState(() => localStorage.getItem('aidly_voice_enabled') === 'true');
  const [emotionSensitivity, setEmotionSensitivity] = useState<'Low' | 'Medium' | 'High'>(() => (localStorage.getItem('aidly_emotion_sensitivity') as any) || 'Medium');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [feedbackingMsgId, setFeedbackingMsgId] = useState<string | null>(null);
  const [tempFeedbackText, setTempFeedbackText] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const saveChatHistory = (psychId: string, messages: Message[]) => {
    const updatedChats = { ...allChats, [psychId]: messages };
    setAllChats(updatedChats);
    localStorage.setItem('aidly_chats', JSON.stringify(updatedChats));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              transcript += event.results[i][0].transcript;
            }
            setInputText(transcript);
          };

          recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };
          recognitionRef.current = recognition;
        }
      } catch (err) {
        console.error("Speech Recognition Init Error:", err);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = lang === 'az' ? 'az-AZ' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        // Fallback for missing recognition
        console.warn("Speech recognition not available");
      }
    }
  };

  const speakText = (text: string) => {
    if (!isAiVoiceEnabled || typeof window === 'undefined') return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const startSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a suitable voice
      if (lang === 'az') {
        // Priority: 1. Native AZ, 2. Turkish (very similar phonetics), 3. Any voice
        const azVoice = voices.find(v => v.lang.includes('az') || v.name.toLowerCase().includes('azerbaijan'));
        const trVoice = voices.find(v => v.lang.includes('tr') || v.name.toLowerCase().includes('turkish'));
        
        if (azVoice) {
          utterance.voice = azVoice;
          utterance.lang = 'az-AZ';
        } else if (trVoice) {
          utterance.voice = trVoice;
          utterance.lang = 'tr-TR'; // Better fallback than English
        } else {
          utterance.lang = 'az-AZ';
        }
      } else {
        const enVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Premium')));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeak;
    } else {
      startSpeak();
    }
  };

  useEffect(() => {
    // Load local data
    try {
      const savedSessions = localStorage.getItem('aidly_sessions');
      const savedResults = localStorage.getItem('aidly_results');
      const savedTheme = localStorage.getItem('aidly_theme');
      const savedChats = localStorage.getItem('aidly_chats');
      const savedBookings = localStorage.getItem('aidly_bookings');
      
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedResults) setTestResults(JSON.parse(savedResults));
      if (savedTheme) setTheme(savedTheme as 'dark' | 'light');
      if (savedChats) setAllChats(JSON.parse(savedChats));
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    } catch (e) {
      console.warn("Failed to load local data:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aidly_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('aidly_results', JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const toggleLang = () => setLang(l => l === 'az' ? 'en' : 'az');

  const toggleAudio = (id: string, url: string) => {
    if (activeAudioId === id) {
      if (isPlayingAudio) {
        audioRef.current?.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current?.play();
        setIsPlayingAudio(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(url);
      newAudio.onended = () => {
        setIsPlayingAudio(false);
        setActiveAudioId(null);
      };
      newAudio.loop = true;
      audioRef.current = newAudio;
      audioRef.current.play();
      setActiveAudioId(id);
      setIsPlayingAudio(true);
    }
  };
  
  const addSession = (psych: typeof PSYCHOLOGISTS[0]) => {
    setSessions(prev => {
      if (!prev.find(s => s.id === psych.id)) {
        const newSession: Session = {
          id: psych.id,
          nameAz: psych.nameAz,
          nameEn: psych.nameEn,
          specialtyAz: psych.specialtyAz,
          specialtyEn: psych.specialtyEn,
          avatar: psych.avatar
        };
        const newSessions = [...prev, newSession];
        localStorage.setItem('aidly_sessions', JSON.stringify(newSessions));
        return newSessions;
      }
      return prev;
    });
    setActiveTab('sessions');
  };

  const addBooking = (time: string) => {
    if (!selectedPsychForBooking) return;
    const newBooking: Booking = {
      id: Date.now().toString(),
      psychId: selectedPsychForBooking.id,
      psychNameAz: selectedPsychForBooking.nameAz,
      psychNameEn: selectedPsychForBooking.nameEn,
      specialtyAz: selectedPsychForBooking.specialtyAz,
      specialtyEn: selectedPsychForBooking.specialtyEn,
      avatar: selectedPsychForBooking.avatar,
      time: time,
      date: new Date().toLocaleDateString()
    };
    setBookings(prev => {
      const newBookings = [newBooking, ...prev];
      localStorage.setItem('aidly_bookings', JSON.stringify(newBookings));
      return newBookings;
    });
    setIsBookingModalOpen(false);
    setSelectedPsychForBooking(null);
    setActiveTab('sessions');
  };

  const removeBooking = (id: string) => {
    setBookings(prev => {
      const newBookings = prev.filter(b => b.id !== id);
      localStorage.setItem('aidly_bookings', JSON.stringify(newBookings));
      return newBookings;
    });
  };

  const removeSession = (id: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      localStorage.setItem('aidly_sessions', JSON.stringify(newSessions));
      return newSessions;
    });
    
    setAllChats(prev => {
      const updatedChats = { ...prev };
      delete updatedChats[id];
      localStorage.setItem('aidly_chats', JSON.stringify(updatedChats));
      return updatedChats;
    });
    
    if (activeChatPsych === id) {
      setIsChatOpen(false);
      setActiveChatPsych(null);
    }
  };

  const handleTestAnswer = async (weight: number) => {
    const newAnswers = [...currentTestAnswers, weight];
    setCurrentTestAnswers(newAnswers);
    
    if (testStep + 1 < QUESTIONS.length) {
      setTestStep(testStep + 1);
    } else {
      // Test finished
      const avgScore = Math.round(newAnswers.reduce((a, b) => a + b, 0) / QUESTIONS.length);
      const finalScore = Math.max(10, Math.min(100, avgScore));
      
      setIsTesting(true);
      setShowScore(finalScore);
      
      const advice = await getAIAdvice(finalScore, lang);
      
      const newResult: TestResult = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        score: finalScore,
        advice: advice,
        mood: finalScore > 75 ? "😊" : finalScore > 45 ? "😐" : "😔"
      };

      const updatedResults = [newResult, ...testResults];
      setTestResults(prev => [newResult, ...prev]);
      
      setTempAdvice(advice);
      setIsTesting(false);
    }
  };

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    
    const userMsg: Message = { id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, role: 'user', content: inputText };
    const currentHistory = chatMessages.map(m => ({ role: m.role, content: m.content }));
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const psych = PSYCHOLOGISTS.find(p => p.id === activeChatPsych);
      const specialty = lang === 'az' ? psych?.specialtyAz : psych?.specialtyEn;
      const psychName = lang === 'az' ? psych?.nameAz : psych?.nameEn;
      const response = await getAICounseling(inputText, currentHistory, lang, specialty || "", psychName || "", emotionSensitivity);
      
      setIsTyping(false);
      
      // Parse emotion tag: [EMOTION: value]
      let cleanText = response.text;
      let emotion = "";
      const emotionMatch = response.text.match(/\[EMOTION:\s*([^\]]+)\]/);
      if (emotionMatch) {
        emotion = emotionMatch[1].trim().toLowerCase();
        cleanText = response.text.replace(/\[EMOTION:\s*[^\]]+\]/, "").trim();
      }

      const aiMsg: Message = { 
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
        role: 'model', 
        content: cleanText,
        detectedEmotion: emotion
      };
      
      // Speak AI response if enabled
      if (isAiVoiceEnabled) {
        speakText(cleanText);
      }

      const finalMessages = [...newMessages, aiMsg];
      setChatMessages(finalMessages);
      if (activeChatPsych) {
        saveChatHistory(activeChatPsych, finalMessages);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setIsTyping(false);
    }
  };

  const handleFeedback = (msgId: string, rating: 'positive' | 'negative' | null) => {
    const updatedMessages = chatMessages.map(m => 
      m.id === msgId ? { ...m, feedback: m.feedback === rating ? null : rating } : m
    );
    setChatMessages(updatedMessages);
    if (activeChatPsych) {
      saveChatHistory(activeChatPsych, updatedMessages);
    }
    
    // Open comment box if negative or if user wants to add more
    if (rating === 'negative') {
      setFeedbackingMsgId(msgId);
      const currentMsg = updatedMessages.find(m => m.id === msgId);
      setTempFeedbackText(currentMsg?.feedbackComment || "");
    }
  };

  const submitFeedbackComment = (msgId: string) => {
    const updatedMessages = chatMessages.map(m => 
      m.id === msgId ? { ...m, feedbackComment: tempFeedbackText } : m
    );
    setChatMessages(updatedMessages);
    if (activeChatPsych) {
      saveChatHistory(activeChatPsych, updatedMessages);
    }
    setFeedbackingMsgId(null);
    setTempFeedbackText("");
  };

  const startChat = (id: string) => {
    setActiveChatPsych(id);
    setIsChatOpen(true);
    
    if (allChats[id] && Array.isArray(allChats[id]) && allChats[id].length > 0) {
      setChatMessages(allChats[id]);
    } else {
      const initialMsgs: Message[] = [
        { id: `sys-${Date.now()}`, role: 'model', content: lang === 'az' ? "Salam! Mən sizin AI məsləhətçinizəm. Bu gün sizə necə kömək edə bilərəm?" : "Hi! I am your AI counselor. How can I help you today?" }
      ];
      setChatMessages(initialMsgs);
      saveChatHistory(id, initialMsgs);
    }
  };

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    const psychId = activeChatPsych || (sessions.length > 0 ? sessions[0].id : PSYCHOLOGISTS[0].id);
    // Safety check to ensure we use an AI psychologist for mood chat
    let psych = PSYCHOLOGISTS.find(p => p.id === psychId);
    if (!psych) psych = PSYCHOLOGISTS[0];
    
    setSessions(prev => {
      if (!prev.find(s => s.id === psych.id)) {
        const newSessions = [...prev, psych!];
        localStorage.setItem('aidly_sessions', JSON.stringify(newSessions));
        return newSessions;
      }
      return prev;
    });

    setActiveChatPsych(psych.id);
    setIsChatOpen(true);

    let content = "";
    if (lang === 'az') {
      if (mood === "😊") content = "Əla! Sizi belə şən görmək çox xoşdur. Bu gün sizi ən çox nə sevindirdi?";
      else if (mood === "😐") content = "Sakin bir gün keçirirsiniz. Gününüzü daha da maraqlı etmək üçün nə edə bilərik?";
      else if (mood === "😔") content = "Biraz kədərli olduğunuzu hiss edirəm. Sizi narahat edən nə isə var? Mənimlə bölüşmək istərdiniz?";
      else if (mood === "😰") content = "Görünür, gərginlik var. Gəlin birlikdə nəfəs alaq. Sizi ən çox nə stresə salır?";
      else content = "Salam! Özünüzü necə hiss edirsiniz?";
    } else {
      if (mood === "😊") content = "Great! It's lovely to see you so happy. What made you most joyful today?";
      else if (mood === "😐") content = "Having a calm day. What can we do to make your day more interesting?";
      else if (mood === "😔") content = "I feel that you are a bit sad. Is there something bothering you? Would you like to share it with me?";
      else if (mood === "😰") content = "It seems you're stressed. Let's take a breath together. What is stressing you out the most?";
      else content = "Hello! How are you feeling today?";
    }

    const currentHistory = allChats[psych.id] || [];
    const aiMsg: Message = { id: `mood-${Date.now()}-${Math.random()}`, role: 'model', content: content };
    const newHistory = [...currentHistory, aiMsg];
    setChatMessages(newHistory);
    saveChatHistory(psych.id, newHistory);
  };

  const clearCurrentChat = () => {
    if (activeChatPsych) {
      const initialMsgs: Message[] = [
        { id: 'start', role: 'model', content: lang === 'az' ? "Salam! Mən sizin AI məsləhətçinizəm. Bu gün sizə necə kömək edə bilərəm?" : "Hi! I am your AI counselor. How can I help you today?" }
      ];
      setChatMessages(initialMsgs);
      saveChatHistory(activeChatPsych, initialMsgs);
    }
  };

  const removeResult = (id: string) => {
    setTestResults(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('aidly_results', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllResults = () => {
    setTestResults([]);
    localStorage.removeItem('aidly_results');
  };

  const t = (az: string, en: string) => lang === 'az' ? az : en;

  // Renderers
  const renderHome = () => (
    <div className="p-5 space-y-8">
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
        <h2 className="text-2xl font-black tracking-tight">{t("Salam, Əli", "Hello, Ali")}</h2>
      </div>

      {/* Mood Section */}
      <div className={`p-6 rounded-[32px] glass ${theme === 'dark' ? 'glass-dark bg-[#0E1521]' : 'glass-light bg-navy/5'} space-y-4`}>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center">{t("BU GÜN NECƏSƏN?", "HOW ARE YOU TODAY?")}</h3>
        <div className="flex justify-between items-center px-2">
          {[
            { id: 'happy', emoji: "😊" },
            { id: 'neutral', emoji: "😐" },
            { id: 'sad', emoji: "😔" },
            { id: 'worried', emoji: "😰" }
          ].map((m) => (
            <motion.button
              key={m.id}
              onClick={() => handleMoodClick(m.emoji)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all ${selectedMood === m.emoji ? 'ring-4 ring-teal-brand ring-offset-4 ring-offset-navy/20' : 'bg-white/5'}`}
            >
              {m.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4 pb-12">
        {[
          { icon: <ClipboardList size={22} />, label: t("Özünü qiymətləndir", "Self-assess"), color: "bg-orange-brand/10 text-orange-brand", onClick: () => setActiveTab('test') },
          { icon: <UserCheck size={22} />, label: t("Psixoloq tap", "Find psychologist"), color: "bg-teal-brand/10 text-teal-brand", onClick: () => setActiveTab('sessions') },
          { icon: <Home size={22} />, label: t("Sosial xidmətlər", "Social services"), color: "bg-indigo-500/10 text-indigo-400", onClick: () => setActiveTab('social_services') },
          { icon: <BookOpen size={22} />, label: t("Resurslar", "Resources"), color: "bg-purple-500/10 text-purple-400", onClick: () => setActiveTab('resources') }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            onClick={item.onClick}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`p-4 rounded-[28px] glass ${theme === 'dark' ? 'glass-dark border-white/5 bg-white/5 text-white' : 'glass-light border-navy/5 bg-navy/5 text-navy'} flex flex-col items-start gap-3 cursor-pointer border shadow-sm transition-colors`}
          >
            <div className={`p-3 rounded-2xl ${item.color} shadow-inner`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-black leading-tight tracking-tight opacity-90">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSocialServices = () => (
    <div className="flex flex-col h-full bg-[#0D1117] text-[#E6EDF3] -mt-16 pt-16">
      {/* Page Header */}
      <div className="px-5 py-4 flex items-center gap-3 sticky top-0 bg-[#0D1117]/90 backdrop-blur-xl z-50 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black tracking-tight">{t("Sosial Xidmətlər", "Social Services")}</h2>
        <div className="ml-auto text-lg font-black tracking-tighter">Aid<span className="text-orange-brand">ly</span></div>
      </div>

      <div className="p-5 space-y-6">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-brand">{t("DÖVLƏT & İCTİMAİ DƏSTƏK", "PUBLIC & SOCIAL SUPPORT")}</span>
            <h1 className="text-2xl font-black tracking-tight leading-tight">{t("Sizə uyğun xidməti tapın", "Find the service that fits you")}</h1>
            <p className="text-xs opacity-50 font-bold">{t("Bakı və regionlarda mövcud sosial dəstək mərkəzləri", "Social support centers in Baku and regions")}</p>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 p-3.5 rounded-2xl glass glass-dark bg-white/5 border border-white/5`}>
          <Search size={18} className="opacity-30" />
          <input 
            type="text" 
            placeholder={t("Xidmət və ya mərkəz axtar...", "Search for service or center...")}
            className="bg-transparent border-none outline-none text-xs w-full font-bold placeholder:opacity-30"
          />
        </div>

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { az: "Hamısı", en: "All" },
            { az: "👶 Uşaq", en: "👶 Child" },
            { az: "♿ Əlil", en: "♿ Disability" },
            { az: "👩 Qadın", en: "👩 Women" },
            { az: "👴 Yaşlı", en: "👴 Elderly" },
            { az: "💼 Məşğulluq", en: "💼 Jobs" }
          ].map((chip, idx) => (
            <button 
              key={idx}
              className={`px-4 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all border ${idx === 0 ? 'bg-teal-brand text-navy border-teal-brand' : 'bg-white/5 text-white/40 border-white/5'}`}
            >
              {t(chip.az, chip.en)}
            </button>
          ))}
        </div>

        {/* Emergency Banner */}
        <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">🆘</div>
          <div className="flex-1">
            <strong className="block text-xs font-black text-red-500">{t("Böhran Yardım Xətti", "Crisis Helpline")}</strong>
            <span className="text-[10px] font-bold opacity-60 leading-tight block">{t("Psixoloji təcili yardım • 7/24", "Psychological emergency • 24/7")}</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-500 text-[11px] font-black border border-red-500/30">
            📞 860
          </button>
        </div>

        {/* DOST Centers Highlight */}
        <div className="p-6 rounded-[32px] glass glass-dark bg-teal-brand/5 border border-teal-brand/10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-brand/10 flex items-center justify-center text-3xl">🏛️</div>
            <div>
              <h3 className="text-sm font-black text-teal-brand">{t("DOST Mərkəzləri", "DOST Centers")}</h3>
              <p className="text-[10px] font-bold opacity-40">{t("Dövlət — Özəl — Sosial — Tərəfdaşlıq", "State — Private — Social — Partnership")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { az: "Pensiya sənədləri", en: "Pension docs", icon: "📋" },
              { az: "Əlillik qeydiyyatı", en: "Disability reg", icon: "💊" },
              { az: "Uşaq müavinəti", en: "Child benefits", icon: "👶" },
              { az: "İş axtarışı", en: "Job search", icon: "💼" }
            ].map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2 text-[10px] font-bold opacity-70">
                <span>{s.icon}</span>
                <span>{t(s.az, s.en)}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-3.5 rounded-2xl bg-teal-brand text-navy font-black text-xs shadow-lg shadow-teal-brand/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
            <MapPin size={14} />
            {t("Ən Yaxın Mərkəzi Tap", "Find Nearest Center")}
          </button>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h3 className="text-[12px] font-black uppercase tracking-[0.15em] opacity-40 px-1">{t("Əsas Xidmətlər", "Main Services")}</h3>
          
          {[
            { az: "Sığınacaqlar", en: "Shelters", descAz: "Qadın sığınacaqları, evsizlər üçün gecə mərkəzləri", descEn: "Women's shelters, night centers for homeless", icon: "🏠", color: "#F87171", countAz: "6 Mərkəz", countEn: "6 Centers" },
            { az: "Uşaq Müdafiəsi", en: "Child Protection", descAz: "Uşaq hüquqları xətti, himayəçilik, uşaq evi", descEn: "Child rights line, foster care, orphanage", icon: "👶", color: "#60A5FA", countAz: "116 123", countEn: "116 123" },
            { az: "Əlillik Xidmətləri", en: "Disability Services", descAz: "Reabilitasiya, protez, sosial müavinətlər", descEn: "Rehabilitation, prosthesis, social benefits", icon: "♿", color: "#A78BFA", countAz: "ƏƏSMN", countEn: "MLSPP" },
            { az: "Yaşlı Qayğısı", en: "Elderly Care", descAz: "Evdə qayğı, Qəyyumluq, Pensionerlər evi", descEn: "In-home care, Guardianship, Pensioners home", icon: "👴", color: "#34D399", countAz: "Aktiv", countEn: "Active" },
            { az: "Qadın Dəstəyi", en: "Women's Support", descAz: "Ailə Komitəsi, zorakılıqdan müdafiə", descEn: "Family Committee, protection from violence", icon: "👩", color: "#FB923C", countAz: "152", countEn: "152" }
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-3xl glass glass-dark bg-white/5 border border-white/5 space-y-4"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ backgroundColor: `${service.color}15` }}>
                  {service.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black">{t(service.az, service.en)}</h4>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${service.color}20`, color: service.color }}>
                      {t(service.countAz, service.countEn)}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold opacity-40 leading-snug">{t(service.descAz, service.descEn)}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1 border-t border-white/5">
                <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors">
                  <Phone size={12} />
                  {t("Zəng", "Call")}
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors">
                  <MapPin size={12} />
                  {t("Xəritə", "Map")}
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors">
                  <Info size={12} />
                  {t("Ətraflı", "More")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="h-6" /> {/* Bottom Spacer */}
      </div>
    </div>
  );

  const renderTest = () => {
    if (showScore !== null) {
      return (
        <div className="p-4 flex flex-col h-full justify-center items-center text-center space-y-8">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-32 h-32 rounded-full glass ${theme === 'dark' ? 'glass-dark' : 'glass-light'} flex flex-col items-center justify-center border-4 border-teal-brand/40 shadow-[0_0_30px_rgba(0,212,200,0.2)]`}
          >
            <span className="text-4xl font-black text-teal-brand tracking-tighter">{showScore}</span>
            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{t("BAL", "SCORE")}</span>
          </motion.div>
          
          <div className="space-y-4 max-w-[280px]">
            <h3 className="text-xl font-bold">{t("Yoxlama Başa Çatdı!", "Test Completed!")}</h3>
            {tempAdvice && (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-[11px] font-black italic opacity-100 leading-relaxed text-teal-brand bg-teal-brand/5 p-4 rounded-2xl border border-teal-brand/10 shadow-inner"
                 >
                   "{tempAdvice}"
                 </motion.p>
            )}
            <p className="text-[10px] opacity-40 font-bold leading-relaxed">
              {t("Nəticələriniz hesablandı və mütəxəssis məsləhəti hazırlandı.", "Your results have been calculated and expert advice is ready.")}
            </p>
          </div>

          <button 
            onClick={() => {
              setShowScore(null);
              setTestStep(0);
              setCurrentTestAnswers([]);
              setActiveTab('results');
            }}
            className="w-full py-4 rounded-3xl bg-teal-brand text-navy font-bold shadow-lg shadow-teal-brand/20 active:scale-95 transition-transform"
          >
            {t("Nəticələrə Bax", "View Results")}
          </button>
        </div>
      );
    }

    const q = QUESTIONS[testStep];
    const questionText = lang === 'az' ? q.textAz : q.textEn;
    const options = lang === 'az' ? q.optionsAz : q.optionsEn;

    return (
      <div className="p-4 flex flex-col h-full justify-center">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold leading-tight">{questionText}</h2>
            <span className="text-xs opacity-40 font-mono font-bold tracking-tighter">{testStep + 1}/{QUESTIONS.length}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-navy/10'}`}>
            <motion.div 
              className="h-full bg-teal-brand"
              initial={{ width: 0 }}
              animate={{ width: `${((testStep + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <button 
              key={opt}
              onClick={() => handleTestAnswer(q.weights[i])}
              className={`w-full p-4 rounded-2xl text-left text-sm font-semibold glass ${theme === 'dark' ? 'glass-dark hover:bg-white/15' : 'glass-light hover:bg-navy/5'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => (
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

      {testResults.length === 0 ? (
        <div className="py-20 text-center space-y-4">
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
  );

  const renderResources = () => (
    <div className="flex flex-col min-h-full bg-[#0A0C10] text-[#E6EDF3] -mt-16 pt-16">
      {/* Page Header */}
      <div className="px-5 py-4 flex items-center gap-3 sticky top-0 bg-[#0A0C10]/95 backdrop-blur-xl z-50 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1">{t("Resurslar", "Resources")}</h2>
        <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
          <Search size={15} />
        </button>
      </div>

      <div className="flex-1 p-5 space-y-8 overflow-y-auto scrollbar-hide pb-32">
        {/* Featured Hero Card */}
        <div className="relative h-[180px] rounded-[24px] overflow-hidden group cursor-pointer shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-[#1A3A4A] via-[#0D2233] to-[#1A2A1A] opacity-30 flex items-center justify-center text-[80px]">🧠</div>
           <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent" />
           <div className="absolute top-0 right-0 w-32 h-32 bg-teal-brand/20 blur-[60px] rounded-full" />
           
           <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-brand mb-2">{t("✨ HƏFTƏNİN SEÇİMİ", "✨ PICK OF THE WEEK")}</span>
              <h3 className="text-xl font-black leading-tight mb-2">{t("Narahatlığı necə idarə edək?", "How to manage anxiety?") }</h3>
              <p className="text-[11px] font-bold opacity-50 mb-4">{t("📖 8 dəq oxumaq • Dr. Leyla Əliyeva", "📖 8 min read • Dr. Leyla Aliyeva")}</p>
              <button className="px-5 py-2.5 bg-teal-brand text-navy rounded-xl font-black text-[11px] w-fit active:scale-95 transition-transform flex items-center gap-2">
                <Play size={12} fill="currentColor" />
                {t("İndi oxu", "Read now")}
              </button>
           </div>
        </div>

        {/* Mood Filter */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("ƏHVALINIZA GÖRƏ", "BY YOUR MOOD")}</h4>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', emoji: "😊", az: "Hamısı", en: "All" },
              { id: 'stressed', emoji: "😟", az: "Stresli", en: "Stressed" },
              { id: 'tired', emoji: "😴", az: "Yorğun", en: "Tired" },
              { id: 'sad', emoji: "😔", az: "Kədərli", en: "Sad" },
              { id: 'angry', emoji: "😤", az: "Əsəbi", en: "Angry" }
            ].map((m, idx) => (
              <button 
                key={m.id}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-black whitespace-nowrap border transition-all ${idx === 0 ? 'bg-teal-brand/10 border-teal-brand text-teal-brand' : 'bg-white/5 border-white/5 text-white/40'}`}
              >
                <span>{m.emoji}</span>
                {t(m.az, m.en)}
              </button>
            ))}
          </div>
        </div>

        {/* Lane 1: Articles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-black flex items-center gap-2"><BookOpen size={16} /> {t("Məqalələr", "Articles")}</h3>
             <span className="text-[11px] font-black text-teal-brand">{t("Hamısı →", "See all →")}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {[
               { az: "Stress", en: "Stress", titleAz: "Tənəffüs ilə sakit olmağın 5 yolu", titleEn: "5 ways to be calm with breathing", icon: "🌊", bg: "from-[#1A2A3A] to-[#0D1F2D]", color: "#2DD4BF" },
               { az: "Yuxu", en: "Sleep", titleAz: "Daha yaxşı yatmaq üçün gecə rutini", titleEn: "Night routine for better sleep", icon: "🌙", bg: "from-[#2A1A3A] to-[#1A0D2D]", color: "#A78BFA" },
               { az: "Fərqindəlik", en: "Mindfulness", titleAz: "Hər gün 10 dəqiqə meditasiya", titleEn: "10 min meditation every day", icon: "🌿", bg: "from-[#1A3A1A] to-[#0D2D0D]", color: "#34D399" }
             ].map((art, idx) => (
               <div key={idx} className="w-[200px] shrink-0 rounded-2xl overflow-hidden glass glass-dark bg-white/5 border border-white/5 hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className={`h-[110px] flex items-center justify-center text-[44px] bg-gradient-to-br ${art.bg}`}>{art.icon}</div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: art.color }}>{t(art.az, art.en)}</span>
                    <h4 className="text-[12px] font-black leading-tight">{t(art.titleAz, art.titleEn)}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold opacity-30">
                       <span className="flex items-center gap-1"><Clock size={10} /> 5 min</span>
                       <span className="flex items-center gap-1"><Heart size={10} /> 142</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Lane 2: Audio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-black flex items-center gap-2"><Mic size={16} /> {t("Audio & Meditasiya", "Audio & Meditation")}</h3>
             <span className="text-[11px] font-black text-teal-brand">{t("Hamısı →", "See all →")}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {[
               { id: 'sea', titleAz: "Dəniz dalğaları", titleEn: "Sea waves", icon: "🌊", dur: "Loop", bg: "from-[#0D2233] to-[#1A3A4A]", url: "https://assets.mixkit.co/active_storage/sfx/1196/1196-preview.mp3" },
               { id: 'forest', titleAz: "Meşə nəfəsi", titleEn: "Forest breath", icon: "🌲", dur: "Loop", bg: "from-[#0D2D1A] to-[#1A4A2A]", url: "https://assets.mixkit.co/active_storage/sfx/1236/1236-preview.mp3" },
               { id: 'rain', titleAz: "Yağış səsi", titleEn: "Rain sounds", icon: "🌧️", dur: "Loop", bg: "from-[#1A1A2E] to-[#2D1A4A]", url: "https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3" }
             ].map((aud, idx) => (
               <div 
                key={idx} 
                className="w-[140px] shrink-0 space-y-3 cursor-pointer group"
                onClick={() => toggleAudio(aud.id, aud.url)}
               >
                  <div className={`h-[140px] rounded-[24px] flex items-center justify-center text-[52px] bg-gradient-to-br ${aud.bg} relative overflow-hidden border ${activeAudioId === aud.id ? 'border-teal-brand shadow-[0_0_20px_rgba(0,212,200,0.3)]' : 'border-white/5'}`}>
                     <span className={activeAudioId === aud.id && isPlayingAudio ? 'animate-pulse' : ''}>{aud.icon}</span>
                     <div className={`absolute bottom-3 right-3 w-9 h-9 bg-white text-navy rounded-full flex items-center justify-center shadow-lg transition-all ${activeAudioId === aud.id ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}>
                        {activeAudioId === aud.id && isPlayingAudio ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                     </div>
                  </div>
                  <div className="px-1 text-center">
                    <h4 className={`text-[11px] font-black leading-tight mb-1 transition-colors ${activeAudioId === aud.id ? 'text-teal-brand' : ''}`}>{t(aud.titleAz, aud.titleEn)}</h4>
                    <span className="text-[9px] font-bold opacity-30">⏱ {aud.dur}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Lane 3: Books */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-black flex items-center gap-2"><Book size={16} /> {t("Kitab Tövsiyələri", "Book Recommendations")}</h3>
             <span className="text-[11px] font-black text-teal-brand">{t("Hamısı →", "See all →")}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {[
               { title: "Emosional İntellekt", author: "Daniel Goleman", icon: "🧠", bg: "from-[#1A3A2A] to-[#0D2D1A]" },
               { title: "İndiki Anın Gücü", author: "Eckhart Tolle", icon: "🌅", bg: "from-[#2A1A3A] to-[#1A0D2D]" },
               { title: "Atomik Vərdişlər", author: "James Clear", icon: "💪", bg: "from-[#3A2A1A] to-[#2D1A0D]" }
             ].map((book, idx) => (
               <div key={idx} className="w-[120px] shrink-0 space-y-3 cursor-pointer">
                  <div className={`h-[160px] rounded-2xl flex items-center justify-center text-[48px] bg-gradient-to-br ${book.bg} relative border border-white/5`}>
                     <div className="absolute inset-y-0 left-0 w-1.5 bg-black/30" />
                     {book.icon}
                  </div>
                  <div className="px-1 text-center">
                    <h4 className="text-[11px] font-black leading-tight mb-1">{book.title}</h4>
                    <p className="text-[9px] font-bold opacity-30">{book.author}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="h-6" /> {/* Bottom Spacer */}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="flex flex-col min-h-full bg-[#0A0C10] text-[#E6EDF3] -mt-16 pt-16">
      {/* Page Header */}
      <div className="px-5 py-4 flex items-center gap-3 sticky top-0 bg-[#0A0C10]/95 backdrop-blur-xl z-50 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-black tracking-tight flex-1">{t("Psixoloqlar", "Psychologists")}</h2>
      </div>

      <div className="flex-1 p-5 space-y-8 overflow-y-auto scrollbar-hide pb-32">
        {/* Active Sessions - Collapsible/Minified */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("AKTİV ÇATLAR", "ACTIVE CHATS")}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {sessions.map(s => (
                <div key={s.id} className="relative group shrink-0">
                  <div 
                    onClick={() => startChat(s.id)}
                    className="w-16 h-16 rounded-full ring-2 ring-teal-brand/30 p-1 cursor-pointer transform active:scale-95 transition-all"
                  >
                    <img src={s.avatar} alt={s.nameAz} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <button 
                    onClick={() => removeSession(s.id)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-navy scale-0 group-hover:scale-100 transition-transform"
                  >
                    <X size={12} />
                  </button>
                  <p className="text-[9px] font-black text-center mt-2 opacity-60 truncate w-16">{lang === 'az' ? s.nameAz.split(' ')[1] : s.nameEn.split(' ')[1]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directory Toggle */}
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setHomeCategory('ai')}
            className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${homeCategory === 'ai' ? 'bg-teal-brand text-navy shadow-lg' : 'text-white/40'}`}
          >
            {t("🤖 AI DOSTLAR", "🤖 AI BUDDIES")}
          </button>
          <button 
            onClick={() => setHomeCategory('real')}
            className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${homeCategory === 'real' ? 'bg-teal-brand text-navy shadow-lg' : 'text-white/40'}`}
          >
            {t("👨‍⚕️ REAL MÜTƏXƏSSİS", "👨‍⚕️ REAL DOCS")}
          </button>
        </div>

        {/* Psychologist List */}
        <div className="grid gap-4">
          {(homeCategory === 'ai' ? PSYCHOLOGISTS : REAL_PSYCHOLOGISTS).map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-[32px] glass glass-dark bg-white/5 border border-white/5 flex items-center gap-4 hover:border-teal-brand/20 transition-colors`}
            >
              <div className="relative">
                <img src={p.avatar} alt={p.nameAz} className="w-16 h-16 rounded-3xl object-cover ring-1 ring-white/10 shadow-xl" referrerPolicy="no-referrer" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1117] ${homeCategory === 'ai' ? 'bg-teal-brand' : 'bg-orange-brand'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-black truncate">{lang === 'az' ? p.nameAz : p.nameEn}</h4>
                <p className="text-[10px] font-bold opacity-40 truncate">{lang === 'az' ? p.specialtyAz : p.specialtyEn}</p>
                <div className="flex items-center gap-3 mt-3">
                  {homeCategory === 'ai' ? (
                    <button 
                      onClick={() => {
                        addSession(p);
                        startChat(p.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-brand text-navy text-[10px] font-black shadow-lg shadow-teal-brand/20 active:scale-95 transition-transform"
                    >
                      {t("Söhbətə Başla", "Start Chat")}
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedPsychForBooking(p);
                        setIsBookingModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-brand text-white text-[10px] font-black shadow-lg shadow-orange-brand/20 active:scale-95 transition-transform"
                    >
                      {t("Qəbula yazıl", "Book Appointment")}
                    </button>
                  )}
                  <div className="flex items-center gap-1 text-[9px] font-black opacity-30">
                     <Clock size={10} />
                     {homeCategory === 'ai' ? '24/7' : '10:00 - 18:00'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booked Appointments section */}
        {bookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("BRON EDİLMİŞLƏR", "BOOKED APPOINTMENTS")}</h3>
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className={`p-4 rounded-[28px] glass glass-dark bg-teal-brand/5 border border-teal-brand/10 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <img src={b.avatar} alt={b.psychNameAz} className="w-12 h-12 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-[12px] font-black">{lang === 'az' ? b.psychNameAz : b.psychNameEn}</h4>
                      <div className="flex items-center gap-2 text-[9px] font-bold opacity-50 mt-1">
                        <Calendar size={10} /> {b.date} • <Clock size={10} /> {b.time}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeBooking(b.id)}
                    className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-[14px] font-black uppercase tracking-widest text-teal-brand leading-none mb-4 px-1">{t("Parametrlər", "Settings")}</h2>

      <button 
        onClick={() => setActiveTab('results')}
        className="w-full flex items-center justify-between p-4 rounded-3xl glass glass-dark bg-white/5 border border-white/10 hover:border-teal-brand/30 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-brand/20 flex items-center justify-center text-teal-brand">
            <Sparkles size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black group-hover:text-teal-brand transition-colors">{t("Test Tarixçəsi", "Test History")}</h3>
            <p className="text-[10px] font-bold opacity-40">{t("Keçmiş testlərinizin bütün nəticələri", "All results of your past tests")}</p>
          </div>
        </div>
        <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-teal-brand transition-all" />
      </button>

      <div className={`p-5 rounded-3xl glass border border-teal-brand/20 ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-orange-brand flex items-center gap-2">
          <Sparkles size={12} />
          {t("ABUNƏLİK PLANLARI", "SUBSCRIPTION PLANS")}
        </h4>
        <div className="space-y-3">
          {[
            { name: "Free", price: "0 AZN", trial: "1 Month Trial", limits: t("Gündəlik 5 mesaj", "5 messages daily") },
            { name: "Student", price: "4.99 AZN", trial: null, limits: t("Limitsiz AI, Tələbə dəstəyi", "Unlimited AI, Student support") },
            { name: "Pro", price: "14.99 AZN", trial: null, limits: t("Hər şey limitsiz + Real Psixoloq endirimi", "Everything unlimited + Real Psych discount") },
          ].map(plan => (
            <div key={plan.name} className={`p-3 rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-navy/5 bg-navy/5'} flex items-center justify-between`}>
              <div>
                <h5 className="text-xs font-black">{plan.name}</h5>
                <p className="text-[9px] opacity-60 font-bold">{plan.limits} {plan.trial && `(${plan.trial})`}</p>
              </div>
              <span className="text-[10px] font-black text-teal-brand">{plan.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-3xl overflow-hidden glass ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
        <div className="p-4 flex items-center justify-between border-navy/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center glass shadow-inner ${theme === 'dark' ? 'bg-white/10' : 'bg-navy/5'}`}>
              <Moon size={14} />
            </div>
            <span className="text-sm font-bold tracking-tight">{t("Qaranlıq Rejim", "Dark Mode")}</span>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-12 h-6 rounded-full relative transition-all duration-500 ${theme === 'dark' ? 'bg-teal-brand shadow-[0_0_12px_rgba(0,212,200,0.4)]' : 'bg-navy/20'}`}
          >
            <motion.div 
              className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg"
              animate={{ left: theme === 'dark' ? 24 : 4 }}
            />
          </button>
        </div>
        <div className="p-4 flex items-center justify-between border-t border-navy/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center glass shadow-inner ${theme === 'dark' ? 'bg-white/10' : 'bg-navy/5'}`}>
              <Volume2 size={14} />
            </div>
            <span className="text-sm font-bold tracking-tight">{t("Aİ Səsli Cavab", "AI Voice Output")}</span>
          </div>
          <button 
            onClick={() => {
              const newState = !isAiVoiceEnabled;
              setIsAiVoiceEnabled(newState);
              localStorage.setItem('aidly_voice_enabled', String(newState));
              if (!newState) window.speechSynthesis.cancel();
            }}
            className={`w-12 h-6 rounded-full relative transition-all duration-500 ${isAiVoiceEnabled ? 'bg-teal-brand shadow-[0_0_12px_rgba(0,212,200,0.4)]' : 'bg-navy/20'}`}
          >
            <motion.div 
              className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg"
              animate={{ left: isAiVoiceEnabled ? 24 : 4 }}
            />
          </button>
        </div>
        <div className="p-4 flex items-center justify-between border-t border-navy/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center glass shadow-inner ${theme === 'dark' ? 'bg-white/10' : 'bg-navy/5'}`}>
              <Sparkles size={14} />
            </div>
            <span className="text-sm font-bold tracking-tight">{t("Emosiya Həssaslığı", "Emotion Sensitivity")}</span>
          </div>
          <div className="flex gap-1 p-1 rounded-xl glass glass-dark bg-white/5 border border-white/5 scale-90">
            {['Low', 'Medium', 'High'].map((s) => (
              <button 
                key={s}
                onClick={() => {
                  setEmotionSensitivity(s as any);
                  localStorage.setItem('aidly_emotion_sensitivity', s);
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${emotionSensitivity === s ? 'bg-teal-brand text-navy shadow-lg' : 'opacity-40 hover:opacity-100'}`}
              >
                {t(s === 'Low' ? 'Aşağı' : s === 'Medium' ? 'Orta' : 'Yüksək', s)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 flex items-center justify-between border-t border-navy/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center glass shadow-inner ${theme === 'dark' ? 'bg-white/10' : 'bg-navy/5'}`}>
              <Home size={14} />
            </div>
            <span className="text-sm font-bold tracking-tight">{t("Dil", "Language")}</span>
          </div>
          <button onClick={toggleLang} className="text-xs font-black text-teal-brand px-3 py-1 glass glass-dark rounded-full">
            {lang === 'az' ? 'AZ' : 'EN'}
          </button>
        </div>
      </div>

      <div className={`p-5 rounded-3xl glass border border-teal-brand/20 ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-teal-brand flex items-center gap-2">
          <Sparkles size={12} />
          {t("SİZİN GÜVƏNLİYİNİZ", "YOUR SECURITY")}
        </h4>
        <p className="text-[10px] opacity-60 leading-relaxed font-bold tracking-tight">
          {t("Aidly tətbiqində bütün yazışmalar və test nəticələri tamamilə anonimdir. Heç bir məlumat üçüncü tərəflərlə paylaşılmır.", 
             "In the Aidly app, all conversations and test results are completely anonymous. No data is shared with third parties.")}
        </p>
      </div>

      <button className="w-full py-4 text-[10px] font-black text-red-500/60 uppercase tracking-[0.4em] hover:text-red-500 transition-all duration-300">
        {t("HESABI SİL", "DELETE ACCOUNT")}
      </button>
    </div>
  );

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className={`min-h-screen transition-colors duration-700 relative overflow-hidden ${theme === 'dark' ? 'bg-[#050B14] text-white' : 'bg-[#F8FAFF] text-text-light'}`}
    >
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="vibrant-blob top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-brand opacity-20" style={{ animationDelay: '0s' }} />
        <div className="vibrant-blob top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-orange-brand opacity-15" style={{ animationDelay: '-2s' }} />
        <div className="vibrant-blob bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-purple-600 opacity-10" style={{ animationDelay: '-4s' }} />
        <div className="vibrant-blob top-[10%] left-[30%] w-[30vw] h-[30vw] bg-[#00D4C8] opacity-10 blur-[150px]" style={{ animationDelay: '-1s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Landing Navbar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass ${theme === 'dark' ? 'glass-dark bg-navy/80 backdrop-blur-3xl' : 'glass-light bg-white/80 backdrop-blur-3xl'}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black title-font tracking-tighter">
              Aid<span className="text-orange-brand">ly</span>
            </span>
          </div>
          <div className="flex gap-4">
            <button onClick={toggleLang} className={`px-4 py-2 rounded-full text-xs font-black glass shadow-sm ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
              {lang === 'az' ? 'AZ' : 'EN'}
            </button>
          </div>
        </nav>

        <main className="flex-1 pt-24 pb-12 px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 relative z-10 overflow-y-auto min-h-screen scrollbar-hide">
          {/* Landing Copy */}
          <div className="text-center lg:text-left space-y-8 max-w-xl lg:w-1/2">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-6xl md:text-9xl font-black title-font tracking-tighter"
              >
                Aid<span className="text-orange-brand">ly</span>
              </motion.h1>
              <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="text-2xl md:text-4xl font-bold opacity-60 tracking-tight leading-tight"
              >
                {t("Sənin AI Psixoloqun, hər an yanında.", "Your AI Psychologist, always with you.")}
              </motion.p>
            </div>
            <p className="text-lg opacity-40 font-medium max-w-md leading-relaxed">
              {t("Daha yaxşı ruh halı üçün səmimi, anonim və sürətli dəstək. Aidly sizə özünüzü kəşf etməyə kömək edəcək.", 
                 "Sincere, anonymous, and fast support for a better mindset. Aidly will help you discover yourself.")}
            </p>
            
            <div className="hidden lg:flex flex-wrap gap-4 pt-6">
              <div className="px-6 py-4 rounded-[28px] glass glass-dark bg-teal-brand/10 border border-teal-brand/20 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-teal-brand/20 flex items-center justify-center text-teal-brand">
                   <MessageCircle size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t("7/24 DƏSTƏK", "24/7 SUPPORT")}</span>
              </div>
              <div className="px-6 py-4 rounded-[28px] glass glass-dark bg-orange-brand/10 border border-orange-brand/20 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-orange-brand/20 flex items-center justify-center text-orange-brand">
                   <UserCheck size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t("TAM ANONİM", "FULLY ANONYMOUS")}</span>
              </div>
            </div>
          </div>

          {/* iPhone Mockup Container */}
          <div className="relative group scale-[0.75] sm:scale-90 md:scale-95 lg:scale-100 transition-transform flex-shrink-0 lg:w-[360px]">
            {/* Side Buttons - Left (Volume) */}
            <div className="absolute top-32 -left-[2px] w-[3px] h-12 bg-white/20 rounded-r-sm z-0" />
            <div className="absolute top-[180px] -left-[2px] w-[3px] h-12 bg-white/20 rounded-r-sm z-0" />
            {/* Side Button - Right (Power) */}
            <div className="absolute top-44 -right-[2px] w-[3px] h-20 bg-white/20 rounded-l-sm z-0" />

            {/* Outer Glow */}
            <div className="absolute -inset-10 bg-teal-brand/10 blur-[120px] rounded-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-[340px] h-[720px] bg-[#0A0C10] rounded-[60px] p-[10px] relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
            >
              {/* Screen Bezel / Border */}
              <div className="absolute inset-0 rounded-[60px] border-[2px] border-white/5 pointer-events-none z-[70] shadow-2xl" />
              
              {/* Dynamic Island */}
              <motion.div 
                className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[80] flex items-center justify-center gap-2 border border-white/5 shadow-lg"
                whileHover={{ width: 140, height: 32 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-2.5 h-2.5 bg-[#1C1F26] rounded-full border border-white/5" />
                <div className="flex-1" />
                <div className="w-1.5 h-1.5 bg-[#00D4C8] rounded-full animate-pulse opacity-40" />
              </motion.div>
              
              <div className={`w-full h-full rounded-[50px] overflow-hidden relative shadow-inner ${theme === 'dark' ? 'bg-[#0A0C10] bg-gradient-to-b from-[#0A0C10] via-[#0D1117] to-[#0A0C10]' : 'bg-[#F8FAFF]'}`}>
                {/* Status Bar */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-full px-8 text-[9px] font-black opacity-30 z-[70] flex items-center justify-between">
                  <span>9:41</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newState = !isAiVoiceEnabled;
                        setIsAiVoiceEnabled(newState);
                        localStorage.setItem('aidly_voice_enabled', String(newState));
                        if (!newState) window.speechSynthesis.cancel();
                      }}
                      title={t("Səsli cavab", "Voice response")}
                      className="pointer-events-auto hover:opacity-100 transition-opacity p-1"
                    >
                      {isAiVoiceEnabled ? <Volume2 size={10} className="text-teal-brand opacity-100" /> : <VolumeX size={10} />}
                    </button>
                    <Wifi size={10} />
                    <Battery size={10} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                {isAppOn ? (
                  <motion.div 
                    key="app-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full relative"
                  >
                    {/* Screen Content */}
                    <div className="h-full w-full pt-16 pb-32 overflow-y-auto overflow-x-hidden scrollbar-hide">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="min-h-full"
                        >
                          {activeTab === 'home' && renderHome()}
                          {activeTab === 'test' && renderTest()}
                          {activeTab === 'results' && renderResults()}
                          {activeTab === 'sessions' && renderSessions()}
                          {activeTab === 'settings' && renderSettings()}
                          {activeTab === 'social_services' && renderSocialServices()}
                          {activeTab === 'resources' && renderResources()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Bottom Nav */}
                    <div className={`absolute bottom-0 left-0 right-0 h-24 pb-8 flex items-center justify-around px-2 glass z-30 ${theme === 'dark' ? 'glass-dark bg-[#0A0C10]/95 border-t border-white/5' : 'glass-light bg-white/95 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]'}`}>
                      {[
                        { id: 'home', icon: Home, label: t("Ana Səhifə", "Home") },
                        { id: 'social_services', icon: Building, label: t("Xidmətlər", "Services") },
                        { id: 'sessions', icon: Heart, label: t("Mütəxəssis", "Expert") },
                        { id: 'resources', icon: BookOpen, label: t("Resurslar", "Resources") },
                        { id: 'settings', icon: Settings, label: t("Profil", "Profile") },
                      ].map(item => (
                        <motion.button 
                          key={item.id} 
                          onClick={() => setActiveTab(item.id as any)}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-teal-brand scale-110' : 'opacity-30'}`}
                        >
                          <item.icon size={16} />
                          <span className="text-[7px] font-black uppercase tracking-tighter text-center">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* QUICK AI FAB */}
                    {!isChatOpen && activeTab !== 'test' && (
                      <motion.button
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startChat(PSYCHOLOGISTS[0].id)}
                        className="absolute bottom-28 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-teal-brand to-[#00A89F] text-navy flex items-center justify-center shadow-[0_10px_30px_rgba(0,212,200,0.4)] z-40"
                      >
                        <Sparkles size={24} className="animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-brand rounded-full border-2 border-white dark:border-[#0A0C10] animate-bounce" />
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="lock-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full flex flex-col items-center justify-center p-8 space-y-12 bg-gradient-to-br from-navy via-[#0A0C10] to-navy text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-brand/10 blur-[100px] rounded-full" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <Logo size={80} className="mx-auto" />
                      <h2 className="text-3xl font-black tracking-tighter leading-tight">
                        Aid<span className="text-teal-brand">ly</span>
                      </h2>
                      <p className="text-xs font-black opacity-40 uppercase tracking-[0.3em]">
                        {t("SİZİ GÖZLƏYİRİK", "WAITING FOR YOU")}
                      </p>
                    </div>

                    <motion.button
                      onClick={() => setIsAppOn(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-10 py-4 bg-white text-navy rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl active:brightness-90 transition-all z-10"
                    >
                      {t("BAŞLA", "START")}
                      <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    </motion.button>

                    <p className="text-[9px] font-black opacity-20 absolute bottom-12 uppercase tracking-widest px-8">
                       {t("Bütün məlumatlar anonim saxlanılır", "All data is kept anonymous")}
                    </p>
                  </motion.div>
                )}
                </AnimatePresence>
                
                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />

                {/* AI CHAT SHEET - Fixed containment */}
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
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className={`w-full max-w-xl h-[92%] rounded-t-[40px] flex flex-col shadow-2xl relative glass ${theme === 'dark' ? 'glass-dark bg-navy/95 border-t border-white/20' : 'glass-light bg-white/95 border-t border-navy/10'}`}
                      >
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-navy/5 dark:border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-brand/10 glass glass-dark flex items-center justify-center text-teal-brand">
                              <MessageCircle size={18} />
                            </div>
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest">{t("AI Məsləhətçi", "AI Counselor")}</h3>
                              <p className="text-[8px] opacity-50 flex items-center gap-1 font-black">
                                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                {t("AI aktivdir", "AI is active")}
                              </p>
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
                              title={t("Səsli oxuma", "Text to speech")}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAiVoiceEnabled ? 'bg-teal-brand text-navy' : theme === 'dark' ? 'bg-white/5 text-white/50' : 'bg-navy/5 text-navy/50'}`}
                            >
                              {isAiVoiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                            </button>
                            <button 
                              onClick={clearCurrentChat} 
                              title={t("Çatı təmizlə", "Clear chat")}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-white/50 hover:text-red-400 hover:bg-white/10' : 'bg-navy/5 text-navy/50 hover:text-red-500 hover:bg-navy/10'}`}
                            >
                              <Trash2 size={14} />
                            </button>
                            <button onClick={() => setIsChatOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:rotate-90 ${theme === 'dark' ? 'bg-white/5 text-white/50 hover:text-white' : 'bg-navy/5 text-navy/50 hover:text-navy'}`}>
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth scrollbar-hide relative">
                          {chatMessages.map(m => (
                            <motion.div 
                              key={m.id} 
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                              <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed glass ${
                                m.role === 'user' 
                                  ? 'bg-orange-brand text-white rounded-tr-none shadow-lg shadow-orange-brand/20 font-black' 
                                  : theme === 'dark' ? 'glass-dark bg-white/10 text-white/90 rounded-tl-none font-bold' : 'glass-light bg-navy/5 text-navy rounded-tl-none font-bold'
                              }`}>
                                {m.content}
                              </div>

                              {m.detectedEmotion && (
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/40' : 'bg-navy/5 border-navy/5 text-navy/40'}`}
                                >
                                  <span className="text-xs">
                                    {m.detectedEmotion.includes('kədər') || m.detectedEmotion.includes('sad') ? '😔' : 
                                     m.detectedEmotion.includes('stress') ? '😰' : 
                                     m.detectedEmotion.includes('xoşbəxt') || m.detectedEmotion.includes('happy') ? '😊' : 
                                     m.detectedEmotion.includes('qorx') || m.detectedEmotion.includes('scar') ? '😨' : '😐'}
                                  </span>
                                  {lang === 'az' ? 'Duyğu:' : 'Emotion:'} {m.detectedEmotion}
                                </motion.div>
                              )}
                              
                              {m.role === 'model' && m.id !== 'start' && (
                                <div className="mt-1.5 flex items-center gap-3 px-1">
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => handleFeedback(m.id, 'positive')}
                                      className={`p-1.5 rounded-lg transition-colors ${m.feedback === 'positive' ? 'text-teal-brand bg-teal-brand/10' : 'opacity-20 hover:opacity-50'}`}
                                    >
                                      <ThumbsUp size={12} fill={m.feedback === 'positive' ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                      onClick={() => handleFeedback(m.id, 'negative')}
                                      className={`p-1.5 rounded-lg transition-colors ${m.feedback === 'negative' ? 'text-red-400 bg-red-400/10' : 'opacity-20 hover:opacity-50'}`}
                                    >
                                      <ThumbsDown size={12} fill={m.feedback === 'negative' ? "currentColor" : "none"} />
                                    </button>
                                  </div>
                                  
                                  {m.feedback && (
                                    <button 
                                      onClick={() => {
                                        setFeedbackingMsgId(m.id);
                                        setTempFeedbackText(m.feedbackComment || "");
                                      }}
                                      className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-teal-brand transition-all"
                                    >
                                      {m.feedbackComment ? t("DÜZƏLİŞ ET", "EDIT FEEDBACK") : t("RƏY BİLDİR", "ADD COMMENT")}
                                    </button>
                                  )}
                                </div>
                              )}

                              {feedbackingMsgId === m.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="w-[85%] mt-2 space-y-2"
                                >
                                  <textarea 
                                    autoFocus
                                    value={tempFeedbackText}
                                    onChange={(e) => setTempFeedbackText(e.target.value)}
                                    placeholder={t("Nəyi təkmilləşdirə bilərik?", "How can we improve?")}
                                    className={`w-full p-3 rounded-xl text-[10px] font-bold outline-none glass ${theme === 'dark' ? 'glass-dark bg-white/5 border-white/10 focus:border-teal-brand/30' : 'glass-light bg-navy/5 border-navy/5 focus:border-teal-brand/30'}`}
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => submitFeedbackComment(m.id)}
                                      className="px-4 py-2 bg-teal-brand text-navy rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-teal-brand/20"
                                    >
                                      {t("GÖNDƏR", "SEND")}
                                    </button>
                                    <button 
                                      onClick={() => setFeedbackingMsgId(null)}
                                      className="px-4 py-2 opacity-40 text-[9px] font-black uppercase tracking-widest"
                                    >
                                      {t("LƏĞV ET", "CANCEL")}
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                              
                              {m.feedbackComment && feedbackingMsgId !== m.id && (
                                <div className={`mt-2 p-2 rounded-xl text-[9px] font-bold italic opacity-60 border-l-2 border-teal-brand/40 ml-1`}>
                                  "{m.feedbackComment}"
                                </div>
                              )}
                            </motion.div>
                          ))}
                          {isTyping && (
                            <div className="flex justify-start items-center gap-2">
                              <div className={`p-3 rounded-2xl rounded-tl-none flex gap-1 glass ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
                                <span className="w-1.5 h-1.5 bg-teal-brand rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-teal-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <span className="w-1.5 h-1.5 bg-teal-brand rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 animate-pulse">
                                {t("AI düşünür...", "AI is thinking...")}
                              </span>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-navy/5 dark:border-white/5 flex gap-2">
                          <button 
                            type="button"
                            onClick={toggleListening}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' : theme === 'dark' ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-navy/5 text-navy/40 hover:bg-navy/10'}`}
                          >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                          </button>
                          <div className="relative flex-1">
                            <input 
                              type="text" 
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                              placeholder={t("Mesaj yazın...", "Type a message...")}
                              className={`w-full py-3 pr-12 pl-4 rounded-xl text-xs font-bold outline-none glass ${theme === 'dark' ? 'glass-dark bg-white/5 focus:bg-white/10' : 'glass-light bg-navy/5 focus:bg-white border border-navy/5'}`}
                            />
                            <button 
                              type="submit"
                              disabled={!inputText.trim() || isTyping}
                              className={`absolute right-1 top-1 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${inputText.trim() ? 'bg-teal-brand text-navy shadow-lg shadow-teal-brand/20' : 'bg-white/5 text-white/20'}`}
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BOOKING MODAL - Fixed containment */}
                <AnimatePresence>
                  {isBookingModalOpen && selectedPsychForBooking && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`w-full max-w-sm rounded-[32px] p-6 space-y-6 glass ${theme === 'dark' ? 'glass-dark border border-white/10' : 'glass-light bg-white border border-navy/10'}`}
                      >
                        <div className="text-center space-y-2">
                          <img src={selectedPsychForBooking.avatar} className="w-16 h-16 rounded-full mx-auto border-3 border-teal-brand/40 shadow-xl" referrerPolicy="no-referrer" />
                          <div className="space-y-0.5">
                            <h2 className="text-sm font-black">{lang === 'az' ? selectedPsychForBooking.nameAz : selectedPsychForBooking.nameEn}</h2>
                            <p className="text-[9px] font-bold text-teal-brand uppercase tracking-widest">{lang === 'az' ? selectedPsychForBooking.specialtyAz : selectedPsychForBooking.specialtyEn}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                            <Clock size={10} />
                            {t("GÖRÜŞ SAATI SEÇİN", "SELECT APPOINTMENT TIME")}
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                          {["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "18:00", "19:00", "20:00"].map(time => (
                              <motion.button 
                                key={time}
                                onClick={() => addBooking(time)}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 200, 1)", color: "#07192e" }}
                                whileTap={{ scale: 0.95 }}
                                className={`py-2 rounded-xl text-[10px] font-black transition-all glass ${theme === 'dark' ? 'glass-dark bg-white/5 border-none' : 'glass-light bg-navy/5 border-none'}`}
                              >
                                {time}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => { setIsBookingModalOpen(false); setSelectedPsychForBooking(null); }}
                          className={`w-full py-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity`}
                        >
                          {t("LƏĞV ET", "CANCEL")}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

