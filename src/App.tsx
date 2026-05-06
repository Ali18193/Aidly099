/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from 'react';
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
  MessageSquare,
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
  ExternalLink,
  Globe,
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
  ThumbsDown,
  Bookmark,
  CheckCircle,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAIAdvice, getAICounseling, getAICounselingStream } from './lib/gemini';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { auth } from './lib/firebase';
import { AuthPage } from './components/AuthPage';
import { 
  onAuthStateChanged, 
  User, 
  signOut, 
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

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
  { id: '2', nameAz: 'Dr. Samir Qasımov', nameEn: 'Dr. Samir Gasimov', specialtyAz: 'Təşviş və Stress', specialtyEn: 'Anxiety and Stress', avatar: 'https://picsum.photos/seed/samir/100/100', rating: "4.9", chatCount: "2.3k" },
  { id: '3', nameAz: 'Dr. Günel Sadıqova', nameEn: 'Dr. Gunel Sadiqova', specialtyAz: 'Uşaq Psixoloqu', specialtyEn: 'Child Psychologist', avatar: 'https://picsum.photos/seed/gunel/100/100', rating: "4.8", chatCount: "1.9k" },
  { id: '4', nameAz: 'Aydan (Tələbə Dostu)', nameEn: 'Aydan (Student Buddy)', specialtyAz: 'Tələbə və məktəblilər üçün', specialtyEn: 'For Students and Pupils', avatar: 'https://picsum.photos/seed/student/100/100', rating: "4.9", chatCount: "3.1k" },
];

const REAL_PSYCHOLOGISTS = [
  { id: 'r1', nameAz: 'Dr. Orxan Məmmədov', nameEn: 'Dr. Orkhan Mammadov', specialtyAz: 'Psixoterapevt', specialtyEn: 'Psychotherapist', avatar: 'https://picsum.photos/seed/orxan/100/100', rating: "4.7", sessionCount: "128", price: "60" },
  { id: 'r2', nameAz: 'Dr. Nigar Rzayeva', nameEn: 'Dr. Nigar Rzayeva', specialtyAz: 'Ailə Psixoloqu', specialtyEn: 'Family Psychologist', avatar: 'https://picsum.photos/seed/nigar/100/100', rating: "4.9", sessionCount: "256", price: "50" },
];

const QUESTIONS_TEST = [
  { id: 1, textAz: "Özümü tez-tez gərgin hiss edirəm.", textEn: "I often feel tense." },
  { id: 2, textAz: "Yuxuya getməkdə çətinlik çəkirəm.", textEn: "I have trouble falling asleep." },
  { id: 3, textAz: "Gələcəyə ümidsiz baxıram.", textEn: "I look at the future hopelessly." },
  { id: 4, textAz: "Etməkdən zövq aldığım şeylərə marağım azalıb.", textEn: "I've lost interest in things I used to enjoy." },
  { id: 5, textAz: "Diqqətimi toplamaqda çətinlik çəkirəm.", textEn: "I have difficulty concentrating." },
];

const ARTICLES = [
  {
    id: 1,
    titleAz: "Panika atakı zamanı nə etməli?",
    titleEn: "What to do during a panic attack?",
    category: "Həyəcan",
    time: "4",
    img: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400",
    contentAz: "Panika atakı ani qorxu hissi ilə başlayır. Nəfəs texnikası: 4 saniyə nəfəs al, 4 saxla, 4 burax. Bu texnika sinir sistemini sakitləşdirir.\n\nƏtrafınıza baxın — 5 şey görün, 4 şeyə toxunun, 3 səs eşidin. Bu məşq sizi anda saxlayır.\n\nPanika atakı təhlükəli deyil, keçəcək. Özünüzə deyin: 'Bu keçəcək, mən təhlükəsizəm.' Nəfəs almağa davam edin.",
    contentEn: "A panic attack begins with a sudden feeling of fear. Breathing technique: inhale for 4 seconds, hold for 4, exhale for 4. This calms the nervous system.\n\nLook around — see 5 things, touch 4, hear 3 sounds. This exercise keeps you in the moment.\n\nA panic attack is not dangerous, it will pass. Tell yourself: 'This will pass, I am safe.' Keep breathing."
  },
  {
    id: 2,
    titleAz: "Effektiv yuxu rejimi üçün 5 qayda",
    titleEn: "5 rules for effective sleep routine",
    category: "Yuxu",
    time: "6",
    img: "https://images.unsplash.com/photo-1511295742364-911917175771?auto=format&fit=crop&q=80&w=400",
    contentAz: "1. Hər gün eyni saatda yat və qalx — bioloji saat tənzimlənir.\n\n2. Yatmazdan 1 saat əvvəl ekranları bağla — mavi işıq melatonini bloklayır.\n\n3. Yataq otağını soyuq saxla — 18-20°C ideal temperaturdu.\n\n4. Kofein öğleden sonra içmə — 6 saata qədər təsiri davam edir.\n\n5. Yatmazdan əvvəl 5 dəqiqə nəfəs məşqi et — bədən yuxuya hazırlanır.",
    contentEn: "1. Sleep and wake at the same time every day — regulates your biological clock.\n\n2. Turn off screens 1 hour before bed — blue light blocks melatonin.\n\n3. Keep bedroom cool — 18-20°C is ideal.\n\n4. Avoid caffeine after noon — effects last up to 6 hours.\n\n5. Do 5 minutes of breathing exercises before sleep — the body prepares for rest."
  },
  {
    id: 3,
    titleAz: "İş yerində stressi idarə etmək",
    titleEn: "Managing stress at workplace",
    category: "Stress",
    time: "5",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400",
    contentAz: "İş stresi ən çox nəzarətsizlik hissindən yaranır.\n\nGününüzü planlaşdırın — sabah üçün 3 əsas tapşırıq seçin. Hər 90 dəqiqədə 10 dəqiqə fasilə verin — beyin tsikl ilə işləyir.\n\n'Xeyr' deməyi öyrənin — hər şeyə razı olmaq tükənməyə aparır. Naharı iş masasında yemək stresi artırır, çölə çıxın.",
    contentEn: "Work stress mostly comes from feeling out of control.\n\nPlan your day — choose 3 main tasks for tomorrow. Take a 10-minute break every 90 minutes — the brain works in cycles.\n\nLearn to say no — agreeing to everything leads to burnout. Eating lunch at your desk increases stress, go outside."
  },
  {
    id: 4,
    titleAz: "Özünə hörmət necə artırılır?",
    titleEn: "How to improve self-esteem?",
    category: "Depressiya",
    time: "7",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    contentAz: "Özünə hörmət hər gün kiçik qələbələrlə qurulur.\n\nÖzünüzlə danışarkən dosta danışdığınız kimi danışın. Hər axşam 3 şey yazın: bu gün nə yaxşı etdiniz?\n\nMüqayisəni dayandırın — sosial mediada gördükləriniz həqiqətin yalnız bir hissəsidir. Bədəninizə qayğı göstərin — yuxu, hərəkət və qidalanma əhvalınızı birbaşa təsir edir.",
    contentEn: "Self-esteem is built through small daily victories.\n\nTalk to yourself like you would to a friend. Write 3 things each evening: what did you do well today?\n\nStop comparing — what you see on social media is only part of reality. Take care of your body — sleep, movement and nutrition directly affect your mood."
  },
  {
    id: 5,
    titleAz: "Tənhalıq hissi ilə necə mübarizə aparmalı?",
    titleEn: "How to cope with loneliness?",
    category: "Depressiya",
    time: "5",
    img: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=400",
    contentAz: "Tənhalıq insanların yanında da hiss edilə bilər. Bu normal bir emosiyadu, zəiflik deyil.\n\nKönüllü fəaliyyətə qoşulun — məqsəd hissi tənhalığı azaldır. Gündəlik kiçik sosial təmaslara diqqət edin — gülümsəmək, salam vermək.\n\nHeyvan bəsləmək tənhalığı əhəmiyyətli dərəcədə azaldır. Özünüzə vaxt ayırın — tənhalıq ilə yalnızlıq fərqlidir.",
    contentEn: "Loneliness can be felt even among people. This is a normal emotion, not a weakness.\n\nJoin volunteer activities — a sense of purpose reduces loneliness. Pay attention to small daily social contacts — smiling, saying hello.\n\nKeeping a pet significantly reduces loneliness. Give yourself time — loneliness and solitude are different things."
  },
  {
    id: 6,
    titleAz: "Nəfəs məşqləri: ən güclü stres azaldıcı",
    titleEn: "Breathing exercises: the most powerful stress reducer",
    category: "Stress",
    time: "3",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
    contentAz: "Nəfəs almaq yeganə avtomatik prosesdir ki, onu şüurlu idarə edə bilərik.\n\nBox nəfəs: 4 saniyə al, 4 saxla, 4 burax, 4 gözlə. 4-7-8 metodu: 4 al, 7 saxla, 8 burax — ən güclü sakitləşdirici.\n\nGündə 5 dəqiqə bu məşqlər anxiety-ni 40% azaldır. Hər gün səhər oyananda 10 dərin nəfəslə başlayın.",
    contentEn: "Breathing is the only automatic process we can consciously control.\n\nBox breathing: inhale 4s, hold 4s, exhale 4s, wait 4s. 4-7-8 method: inhale 4, hold 7, exhale 8 — the most powerful calming technique.\n\n5 minutes daily reduces anxiety by 40%. Start every morning with 10 deep breaths when you wake up."
  },
  {
    id: 7,
    titleAz: "Uşaqlıq travmaları böyüklüyə necə təsir edir?",
    titleEn: "How childhood trauma affects adulthood?",
    category: "Stress",
    time: "8",
    img: "https://images.unsplash.com/photo-1484665754804-74b091211472?auto=format&fit=crop&q=80&w=400",
    contentAz: "Uşaqlıq travmaları beynin stress reaksiyasını formalaşdırır.\n\nACE (Mənfi Uşaqlıq Təcrübələri) araşdırması göstərir ki, erkən travmalar sağlamlığa uzunmüddətli təsir edir.\n\nAmma beyin dəyişə bilər — bu neyroplastisite adlanır. Terapiya, meditasiya və dəstəkləyici münasibətlər sağalmanı mümkün edir. Kömək istəmək güclülükdür.",
    contentEn: "Childhood traumas shape the brain's stress response.\n\nThe ACE (Adverse Childhood Experiences) study shows early trauma has long-term health effects.\n\nBut the brain can change — this is called neuroplasticity. Therapy, meditation and supportive relationships make healing possible. Asking for help is strength."
  },
  {
    id: 8,
    titleAz: "Yaxşı əhval üçün gündəlik vərdişlər",
    titleEn: "Daily habits for better mood",
    category: "Depressiya",
    time: "4",
    img: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=400",
    contentAz: "Əhvalınızı idarə etmək mümkündür.\n\nSəhər günəş işığı — 10 dəqiqə çöldə olmaq serotonin artırır. Gündə 30 dəqiqə hərəkət — ən güclü antidepressant.\n\nMinnətdarlıq gündəliyi — hər axşam 3 şey yaz. Sosial bağlantı — həftədə bir dəfə yaxın insanla görüş. Bunlar dərman qədər effektivdir.",
    contentEn: "Managing your mood is possible.\n\nMorning sunlight — 10 minutes outside increases serotonin. 30 minutes of movement daily — the most powerful antidepressant.\n\nGratitude journal — write 3 things each evening. Social connection — meet a close person once a week. These are as effective as medication."
  }
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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  const [lang, setLang] = useState<'az' | 'en'>('az');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'home' | 'test' | 'results' | 'sessions' | 'settings' | 'social_services' | 'resources' | 'feedback'>('home');
  const [isAppOn, setIsAppOn] = useState(true);
  const [showScore, setShowScore] = useState<number | null>(null);
  const [homeCategory, setHomeCategory] = useState<'ai' | 'real'>('ai');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPsychForBooking, setSelectedPsychForBooking] = useState<typeof REAL_PSYCHOLOGISTS[0] | null>(null);
  const [selectedDateForBooking, setSelectedDateForBooking] = useState<Date>(new Date());
  
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
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isFeedbackSending, setIsFeedbackSending] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative'>('positive');
  const [feedbackComment, setFeedbackComment] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [psychSearch, setPsychSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [readArticles, setReadArticles] = useState<number[]>([]);
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('Hamısı');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsEmailVerified(currentUser?.emailVerified || false);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user && !isEmailVerified) {
      interval = setInterval(async () => {
        try {
          await user.reload();
          if (user.emailVerified) {
            setIsEmailVerified(true);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Verification poll error:", err);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, isEmailVerified]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsEmailVerified(false);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleAuthAction = async (e: FormEvent, data: any) => {
    e.preventDefault();
    setAuthError(null);
    console.log("Attempting auth action:", authMode, data.email);
    try {
      if (authMode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await sendEmailVerification(userCredential.user);
      } else if (authMode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        setIsEmailVerified(userCredential.user.emailVerified);
      } else if (authMode === 'forgot') {
        await sendPasswordResetEmail(auth, data.email);
        alert(lang === 'az' ? 'Şifrə yeniləmə linki e-poçtunuza göndərildi.' : 'Password reset link sent to your email.');
        setAuthMode('login');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') {
        msg = lang === 'az' ? 'E-poçt və ya şifrə yanlışdır.' : 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = lang === 'az' ? 'İstifadəçi tapılmadı.' : 'User not found.';
      } else if (err.code === 'auth/wrong-password') {
        msg = lang === 'az' ? 'Şifrə yanlışdır.' : 'Wrong password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = lang === 'az' ? 'Bu e-poçt artıq istifadə olunur.' : 'Email already in use.';
      }
      setAuthError(msg);
    }
  };

  const handleResendVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        alert(lang === 'az' ? 'Təsdiq linki yenidən göndərildi.' : 'Verification link resent.');
      } catch (err: any) {
        setAuthError(err.message);
      }
    }
  };

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
    const initNotifications = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await LocalNotifications.requestPermissions();
        }
      } catch (e) {
        console.info("Notifications not supported in this environment");
      }
    };

    initNotifications();
    
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

  const addBooking = async (time: string) => {
    if (!selectedPsychForBooking) return;
    
    const dateStr = selectedDateForBooking.toLocaleDateString(lang === 'az' ? 'az-AZ' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      psychId: selectedPsychForBooking.id,
      psychNameAz: selectedPsychForBooking.nameAz,
      psychNameEn: selectedPsychForBooking.nameEn,
      specialtyAz: selectedPsychForBooking.specialtyAz,
      specialtyEn: selectedPsychForBooking.specialtyEn,
      avatar: selectedPsychForBooking.avatar,
      time: time,
      date: dateStr
    };

    setBookings(prev => {
      const newBookings = [newBooking, ...prev];
      localStorage.setItem('aidly_bookings', JSON.stringify(newBookings));
      return newBookings;
    });

    // Schedule Reminder
    try {
      if (!Capacitor.isNativePlatform()) {
        console.info("Skipping notification schedule on web platform");
        setIsBookingModalOpen(false);
        setSelectedPsychForBooking(null);
        setActiveTab('sessions');
        return;
      }

      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date(selectedDateForBooking);
      reminderTime.setHours(hours, minutes, 0, 0);
      
      // Schedule 30 minutes before
      const scheduleDate = new Date(reminderTime.getTime() - 30 * 60 * 1000);
      
      if (scheduleDate > new Date()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: lang === 'az' ? 'Görüş xatırlatması' : 'Appointment Reminder',
              body: lang === 'az' 
                ? `${selectedPsychForBooking.nameAz} ilə görüşünüz 30 dəqiqə sonra başlayır.` 
                : `Your appointment with ${selectedPsychForBooking.nameEn} starts in 30 minutes.`,
              id: Math.floor(Math.random() * 1000000),
              schedule: { at: scheduleDate },
              sound: 'default'
            }
          ]
        });
      }
    } catch (err) {
      console.warn("Notification error:", err);
    }

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
    const newMessagesPostUser = [...chatMessages, userMsg];
    
    setChatMessages(newMessagesPostUser);
    const sentText = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const psych = PSYCHOLOGISTS.find(p => p.id === activeChatPsych);
      const specialty = lang === 'az' ? psych?.specialtyAz : psych?.specialtyEn;
      const psychName = lang === 'az' ? psych?.nameAz : psych?.nameEn;
      
      let fullAiText = "";
      const aiMsgId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Initial AI message (empty)
      const aiMsg: Message = { 
        id: aiMsgId, 
        role: 'model', 
        content: "",
        detectedEmotion: "normal"
      };
      
      setChatMessages(prev => [...prev, aiMsg]);

      await getAICounselingStream(
        sentText, 
        currentHistory, 
        lang, 
        specialty || "", 
        psychName || "", 
        emotionSensitivity,
        (chunk) => {
          setIsTyping(false); // Hide "Typing..." once we get first chunk
          fullAiText += chunk;
          
          setChatMessages(prev => prev.map(m => {
            if (m.id === aiMsgId) {
              // Parse emotion live if possible, or wait for end
              let cleanText = fullAiText;
              let emotion = m.detectedEmotion || "normal";
              
              const emotionMatch = fullAiText.match(/\[EMOTION:\s*([^\]]+)\]/);
              if (emotionMatch) {
                emotion = emotionMatch[1].trim().toLowerCase();
                cleanText = fullAiText.replace(/\[EMOTION:\s*[^\]]+\]/, "").trim();
              }

              return { ...m, content: cleanText, detectedEmotion: emotion };
            }
            return m;
          }));
        }
      );

      setIsTyping(false);

      // Final chat persistence
      setChatMessages(prev => {
        if (activeChatPsych) {
          saveChatHistory(activeChatPsych, prev);
        }
        
        // Speak AI response if enabled (only after completion)
        const completedMsg = prev.find(m => m.id === aiMsgId);
        if (isAiVoiceEnabled && completedMsg) {
          speakText(completedMsg.content);
        }
        
        return prev;
      });

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

  const getNextDates = (count: number) => {
    const dates = [];
    for (let i = 0; i < count; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isEmailVerified) {
    return (
      <AuthPage 
        authMode={authMode}
        setAuthMode={setAuthMode}
        onAuthAction={handleAuthAction}
        error={authError}
        lang={lang}
        isEmailVerified={isEmailVerified}
        userEmail={user?.email || null}
        onResendVerification={handleResendVerification}
        onSignOut={handleSignOut}
      />
    );
  }

  // Social Services Data
  const SERVICES_DATA = [
    {
      id: 'shelters',
      az: "Sığınacaqlar",
      en: "Shelters",
      descAz: "Qadın sığınacaqları, evsizlər üçün gecə mərkəzləri",
      enDesc: "Women's shelters, night centers for homeless",
      descEn: "Women's shelters, night centers for homeless",
      icon: "🏠",
      color: "#F87171",
      countAz: "6 Mərkəz",
      countEn: "6 Centers",
      filter: "women",
      phone: "152",
      mapQuery: "qadin+siginacaqlari+baku",
      detailAz: "Azərbaycanda qadın sığınacaqları Ailə, Qadın və Uşaq Problemləri üzrə Dövlət Komitəsi tərəfindən idarə olunur. Zorakılığa məruz qalmış qadınlar və uşaqları üçün gecə-gündüz xidmət göstərilir. Ünvan: Bakı, müxtəlif rayonlar.",
      detailEn: "Women's shelters in Azerbaijan are managed by the State Committee for Family, Women and Children Affairs. 24/7 service for women and children subjected to violence.",
      website: "scfwca.gov.az"
    },
    {
      id: 'child',
      az: "Uşaq Müdafiəsi",
      en: "Child Protection",
      descAz: "Uşaq hüquqları xətti, himayəçilik, uşaq evi",
      enDesc: "Child rights line, foster care, orphanage",
      descEn: "Child rights line, foster care, orphanage",
      icon: "👶",
      color: "#60A5FA",
      countAz: "116 123",
      countEn: "116 123",
      filter: "child",
      phone: "116123",
      mapQuery: "usaq+mudafiye+merkezi+baku",
      detailAz: "Uşaq hüquqlarının pozulması, uşağa zülm, laqeydlik hallarında 116 123 nömrəsinə zəng edin. DOST Agentliyi, Əmək və Sosial Müdafiə Nazirliyi tərəfindən idarə olunur. Himayəçilik üçün müraciət də bu xətt vasitəsilə aparılır.",
      detailEn: "Call 116 123 for cases of child rights violations, abuse, or neglect. Managed by DOST Agency and Ministry of Labour. Foster care applications also accepted through this line.",
      website: "sosial.gov.az"
    },
    {
      id: 'disability',
      az: "Əlillik Xidmətləri",
      en: "Disability Services",
      descAz: "Reabilitasiya, protez, sosial müavinətlər",
      enDesc: "Rehabilitation, prosthesis, social benefits",
      descEn: "Rehabilitation, prosthesis, social benefits",
      icon: "♿",
      color: "#A78BFA",
      countAz: "ƏƏSMN",
      countEn: "MLSPP",
      filter: "disability",
      phone: "142",
      mapQuery: "əlillik+reabilitasiya+merkezi+baku",
      detailAz: "Əlillik statusu almaq, protez və ortopedik vasitə, reabilitasiya xidməti üçün DOST mərkəzlərinə müraciət edin (142). Əmək və Əhalinin Sosial Müdafiəsi Nazirliyi (ƏƏSMN) bu xidmətlərə cavabdehdir.",
      detailEn: "Apply at DOST centers for disability status, prosthesis, orthopaedic aids, and rehabilitation services. Call 142. Ministry of Labour and Social Protection (MLSPP) is responsible.",
      website: "dost.gov.az"
    },
    {
      id: 'elderly',
      az: "Yaşlı Qayğısı",
      en: "Elderly Care",
      descAz: "Evdə qayğı, Qəyyumluq, Pensionerlər evi",
      enDesc: "In-home care, Guardianship, Pensioners home",
      descEn: "In-home care, Guardianship, Pensioners home",
      icon: "👴",
      color: "#34D399",
      countAz: "Aktiv",
      countEn: "Active",
      filter: "elderly",
      phone: "142",
      mapQuery: "pensionerler+evi+baku",
      detailAz: "Yaşlı vətəndaşlar üçün evdə qayğı xidməti, pensionerler evi yerləşdirmə, qəyyumluq üçün DOST mərkəzləri vasitəsilə (142) müraciət edə bilərsiniz. Bakıda bir neçə Pensionerlər Evi fəaliyyət göstərir.",
      detailEn: "Elderly citizens can apply through DOST centers (142) for in-home care, pension home placement, and guardianship. Several Pensioners' Homes operate in Baku.",
      website: "dost.gov.az"
    },
    {
      id: 'women',
      az: "Qadın Dəstəyi",
      en: "Women's Support",
      descAz: "Ailə Komitəsi, zorakılıqdan müdafiə",
      enDesc: "Family Committee, protection from violence",
      descEn: "Family Committee, protection from violence",
      icon: "👩",
      color: "#FB923C",
      countAz: "152",
      countEn: "152",
      filter: "women",
      phone: "152",
      mapQuery: "qadin+problemleri+komitesi+baku",
      detailAz: "Məişət zorakılığı, ailə problemləri üçün 152 nömrəsinə zəng edin (Ailə, Qadın və Uşaq Problemləri üzrə Dövlət Komitəsi). Psixoloji dəstək, hüquqi yardım və sığınacaq təmin edilir. 7/24 fəaliyyət göstərir.",
      detailEn: "Call 152 for domestic violence and family issues (State Committee for Family, Women and Children Affairs). Psychological support, legal aid and shelter provided. Operating 24/7.",
      website: "scfwca.gov.az"
    }
  ];

  const handleSendFeedback = async () => {
    if (!feedbackComment.trim() || isFeedbackSending) return;

    setIsFeedbackSending(true);
    try {
      const templateParams = {
        'növ': feedbackType === 'positive' ? t('Müsbət', 'Positive') : t('Mənfi', 'Negative'),
        'nov': feedbackType === 'positive' ? t('Müsbət', 'Positive') : t('Mənfi', 'Negative'),
        'metn': feedbackComment,
        'tarix': new Date().toLocaleString('az-AZ')
      };

      // Wrap emailjs.send in a promise with timeout
      const sendPromise = (window as any).emailjs.send(
        'service_p9ouzod',
        'template_d7tp9iu',
        templateParams
      );

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      // @ts-ignore
      await Promise.race([sendPromise, timeoutPromise]);

      setIsFeedbackSent(true);
      setFeedbackComment("");
    } catch (error) {
      console.error('Feedback error:', error);
      // Even if it fails or times out, we'll tell the user we'll check it later to avoid frustration 
      // but only if it's a timeout.
      if (error instanceof Error && error.message === 'Timeout') {
        setIsFeedbackSent(true); 
        setFeedbackComment("");
      } else {
        alert(t("Geri bildirim göndərilərkən xəta baş verdi.", "An error occurred while sending feedback."));
      }
    } finally {
      setIsFeedbackSending(false);
    }
  };

  // Renderers
  const renderFeedback = () => (
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">{t("ŞƏRHİNİZ", "YOUR COMMENT")}</label>
              <textarea 
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder={t("Fikirlərinizi bura yazın...", "Write your thoughts here...")}
                className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold focus:border-teal-brand outline-none transition-all resize-none"
                disabled={isFeedbackSending}
              />
            </div>

            <button 
              onClick={handleSendFeedback}
              disabled={!feedbackComment.trim() || isFeedbackSending}
              className="w-full py-4 rounded-2xl bg-teal-brand text-navy text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-brand/20 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isFeedbackSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  {t("GÖNDƏRİLİR...", "SENDING...")}
                </>
              ) : t("GÖNDƏR", "SUBMIT")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-teal-brand/20 flex items-center justify-center text-teal-brand mb-6">
            <Sparkles size={40} />
          </div>
          <h3 className="text-xl font-black mb-2">{t("Təşəkkür edirik!", "Thank you!")}</h3>
          <p className="text-xs font-bold opacity-50 mb-8 text-center px-10">{t("Rəyiniz bizim üçün çox dəyərlidir və tətbiqi təkmilləşdirməyə kömək edəcək.", "Your feedback is very valuable to us and will help improve the app.")}</p>
          <button 
            onClick={() => {
              setIsFeedbackSent(false);
              setActiveTab('settings');
            }}
            className="px-8 py-3 rounded-xl bg-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            {t("GERİ DÖN", "GO BACK")}
          </button>
        </div>
      )}
    </div>
  );

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
        <h2 className="text-2xl font-black tracking-tight">{t(`Salam, ${user?.email?.split('@')[0]}`, `Hello, ${user?.email?.split('@')[0]}`)}</h2>
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
              animate={selectedMood === m.emoji ? {
                scale: [1, 1.05, 1],
              } : { scale: 1 }}
              transition={selectedMood === m.emoji ? {
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              } : {}}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all relative ${selectedMood === m.emoji ? 'ring-4 ring-teal-brand ring-offset-4 ring-offset-navy/20' : 'bg-white/5'}`}
            >
              <span className="z-10">{m.emoji}</span>
              {selectedMood === m.emoji && (
                <motion.div
                  layoutId="moodPulse"
                  className="absolute inset-0 bg-teal-brand/20 rounded-full z-0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              )}
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

  const renderSocialServices = () => {
    const filters = [
      { id: 'all',        az: "Hamısı",      en: "All" },
      { id: 'child',      az: "👶 Uşaq",     en: "👶 Child" },
      { id: 'disability', az: "♿ Əlil",     en: "♿ Disability" },
      { id: 'women',      az: "👩 Qadın",    en: "👩 Women" },
      { id: 'elderly',    az: "👴 Yaşlı",    en: "👴 Elderly" },
    ];

    const filteredServices = SERVICES_DATA.filter(s => {
      const matchFilter = activeFilter === 'all' || s.filter === activeFilter;
      const matchSearch = searchQuery === '' ||
        s.az.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.descAz.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });

    const openMap = (query: string) => {
      window.open(`https://www.google.com/maps/search/${query}`, '_blank');
    };

    const makeCall = (phone: string) => {
      window.location.href = `tel:${phone}`;
    };

    const openWebsite = (site: string) => {
      window.open(`https://${site}`, '_blank');
    };

    return (
      <div className="flex flex-col min-h-full bg-[#0D1117] text-[#E6EDF3]">
        
        {/* Modal — Ətraflı məlumat */}
        {selectedService && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center"
            onClick={() => setSelectedService(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-lg bg-[#161B22] rounded-t-[32px] p-6 space-y-5 border border-white/10 pb-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Üst çubuq */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              {/* Başlıq */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ backgroundColor: `${selectedService.color}20` }}
                >
                  {selectedService.icon}
                </div>
                <div>
                  <h3 className="text-base font-black">{t(selectedService.az, selectedService.en)}</h3>
                  <p className="text-[10px] opacity-40 font-bold">{t(selectedService.descAz, selectedService.descEn)}</p>
                </div>
              </div>

              {/* Məlumat mətni */}
              <p className="text-xs font-medium opacity-70 leading-relaxed">
                {t(selectedService.detailAz, selectedService.detailEn)}
              </p>

              {/* Kontakt məlumatları */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[8px] opacity-40 uppercase font-black tracking-widest mb-1">{t("QAYNAR XƏTT", "HOTLINE")}</p>
                  <p className="text-sm font-black" style={{ color: selectedService.color }}>{selectedService.phone}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[8px] opacity-40 uppercase font-black tracking-widest mb-1">{t("SAYT", "WEBSITE")}</p>
                  <p className="text-sm font-black" style={{ color: selectedService.color }}>{selectedService.website}</p>
                </div>
              </div>

              {/* Düymələr */}
              <div className="flex gap-3">
                <button
                  onClick={() => makeCall(selectedService.phone)}
                  className="flex-1 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform text-white"
                  style={{ backgroundColor: selectedService.color }}
                >
                  <Phone size={14} />
                  {t("İndi Zəng Et", "Call Now")}
                </button>
                <button
                  onClick={() => openWebsite(selectedService.website)}
                  className="flex-1 py-3.5 rounded-2xl bg-white/10 border border-white/10 font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <ExternalLink size={14} />
                  {t("Sayta Keç", "Visit Site")}
                </button>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="w-full py-3 rounded-2xl bg-white/5 text-xs font-black opacity-50 active:scale-95 transition-transform"
              >
                {t("Bağla", "Close")}
              </button>
            </div>
          </div>
        )}

        {/* ── Başlıq ── */}
        <div className="px-5 py-4 flex items-center gap-3 sticky top-0 bg-[#0D1117]/90 backdrop-blur-xl z-50 border-b border-white/5">
          <button
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-brand/10 transition-colors active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-black tracking-tight">{t("Sosial Xidmətlər", "Social Services")}</h2>
          <div className="ml-auto text-lg font-black tracking-tighter">Aid<span className="text-orange-brand">ly</span></div>
        </div>

        <div className="p-5 space-y-6 pb-24">

          {/* Hero */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-brand">
              {t("DÖVLƏT & İCTİMAİ DƏSTƏK", "PUBLIC & SOCIAL SUPPORT")}
            </span>
            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {t("Sizə uyğun xidməti tapın", "Find the service that fits you")}
            </h1>
            <p className="text-xs opacity-50 font-bold">
              {t("Bakı və regionlarda mövcud sosial dəstək mərkəzləri", "Social support centers in Baku and regions")}
            </p>
          </div>

          {/* Axtarış */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <Search size={18} className="opacity-30 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t("Xidmət axtar...", "Search service...")}
              className="bg-transparent border-none outline-none text-xs w-full font-bold placeholder:opacity-30"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="opacity-40 hover:opacity-80 transition-opacity shrink-0">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtrlər */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {filters.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all border active:scale-95 ${
                  activeFilter === chip.id
                    ? 'bg-teal-brand text-navy border-teal-brand shadow-lg shadow-teal-brand/20'
                    : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'
                }`}
              >
                {t(chip.az, chip.en)}
              </button>
            ))}
          </div>

          {/* ── Böhran Banneri ── */}
          <button
            onClick={() => makeCall('860')}
            className="w-full p-4 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl shrink-0">🆘</div>
            <div className="flex-1 min-w-0">
              <strong className="block text-xs font-black text-red-400">{t("Böhran Yardım Xətti", "Crisis Helpline")}</strong>
              <span className="text-[10px] font-bold opacity-60 block">{t("Psixoloji təcili yardım • 7/24", "Psychological emergency • 24/7")}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-[11px] font-black border border-red-500/30 shrink-0 flex items-center gap-1.5">
              <Phone size={12} fill="currentColor" />
              860
            </div>
          </button>

          {/* ── DOST Mərkəzləri ── */}
          <div className="p-6 rounded-[32px] bg-teal-brand/5 border border-teal-brand/10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-brand/10 flex items-center justify-center text-3xl">🏛️</div>
              <div>
                <h3 className="text-sm font-black text-teal-brand">{t("DOST Mərkəzləri", "DOST Centers")}</h3>
                <p className="text-[10px] font-bold opacity-40">{t("Dayanıqlı və Operativ Sosial Təminat", "Sustainable and Operative Social Provision")}</p>
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

            <div className="flex gap-2">
              <button
                onClick={() => openMap('DOST+Merkezi+Baku')}
                className="flex-1 py-3.5 rounded-2xl bg-teal-brand text-navy font-black text-xs shadow-lg shadow-teal-brand/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <MapPin size={14} />
                {t("Ən Yaxın Mərkəzi Tap", "Find Nearest Center")}
              </button>
              <button
                onClick={() => makeCall('142')}
                className="w-14 h-12 rounded-2xl bg-teal-brand/10 border border-teal-brand/20 flex items-center justify-center active:scale-95 transition-transform text-teal-brand"
              >
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* ── Xidmətlər Siyahısı ── */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] opacity-40 px-1">
              {t("Əsas Xidmətlər", "Main Services")}
              {filteredServices.length !== SERVICES_DATA.length && (
                <span className="ml-2 text-teal-brand normal-case tracking-normal">({filteredServices.length})</span>
              )}
            </h3>

            {filteredServices.length === 0 ? (
              <div className="py-10 text-center opacity-30">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-xs font-bold">{t("Nəticə tapılmadı", "No results found")}</p>
              </div>
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 rounded-3xl bg-white/5 border border-white/5 space-y-4 active:scale-[0.99] transition-transform"
                >
                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-black">{t(service.az, service.en)}</h4>
                        <span
                          className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                          style={{ backgroundColor: `${service.color}20`, color: service.color }}
                        >
                          {t(service.countAz, service.countEn)}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold opacity-40 leading-snug">{t(service.descAz, service.descEn)}</p>
                    </div>
                  </div>

                  {/* Düymələr — indi işlək */}
                  <div className="flex gap-2 pt-1 border-t border-white/5">
                    <button
                      onClick={() => makeCall(service.phone)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <Phone size={12} />
                      {t("Zəng", "Call")}
                    </button>
                    <button
                      onClick={() => openMap(service.mapQuery)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <MapPin size={12} />
                      {t("Xəritə", "Map")}
                    </button>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <Info size={12} />
                      {t("Ətraflı", "More")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="h-6" />
        </div>
      </div>
    );
  };

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

  const renderArticleDetail = () => {
    const article = selectedArticle;
    if (!article) return null;
    const isSaved = savedArticles.includes(article.id);

    const toggleSave = () => {
      setSavedArticles(prev =>
        prev.includes(article.id)
          ? prev.filter(id => id !== article.id)
          : [...prev, article.id]
      );
    };

    return (
      <div className="flex flex-col min-h-full bg-[#0D1117] text-[#E6EDF3]">
        {/* Başlıq */}
        <div className="px-5 py-4 flex items-center gap-3 sticky top-0 bg-[#0D1117]/90 backdrop-blur-xl z-50 border-b border-white/5">
          <button
            onClick={() => setSelectedArticle(null)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-black tracking-tight flex-1 truncate">
            {t(article.titleAz, article.titleEn)}
          </h2>
          <button
            onClick={toggleSave}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isSaved ? 'bg-teal-brand/20 text-teal-brand' : 'bg-white/5 opacity-40'
            }`}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex-1 pb-20">
          {/* Şəkil */}
          <div className="h-52 overflow-hidden relative">
            <img
              src={article.img}
              alt={article.titleAz}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-teal-brand text-navy"
              >
                {t(article.category, article.category)}
              </span>
              <span className="text-[10px] font-bold opacity-50 flex items-center gap-1">
                <Clock size={10} />
                {article.time} {t("dəq oxu", "min read")}
              </span>
            </div>
          </div>

          {/* Məzmun */}
          <div className="p-5 space-y-5">
            <h1 className="text-xl font-black leading-tight">
              {t(article.titleAz, article.titleEn)}
            </h1>

            <div className="space-y-4">
              {(lang === 'az' ? article.contentAz : article.contentEn)
                .split('\n\n')
                .map((paragraph, idx) => (
                  <p key={idx} className="text-sm font-medium opacity-70 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              }
            </div>

            {/* AI ilə davam et */}
            <div className="mt-6 p-4 rounded-3xl bg-teal-brand/5 border border-teal-brand/10 space-y-3">
              <p className="text-[11px] font-black opacity-60">
                {t("Bu mövzu ilə bağlı sualınız var?", "Have questions about this topic?")}
              </p>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setActiveTab('chat');
                }}
                className="w-full py-3 rounded-2xl bg-teal-brand text-navy font-black text-xs active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} />
                {t("AI ilə müzakirə et", "Discuss with AI")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResources = () => {
    // Əgər məqalə seçilibsə — detail göstər
    if (selectedArticle) return renderArticleDetail();

    const categories = [
      { id: 'Hamısı', az: 'Hamısı', en: 'All' },
      { id: 'Stress', az: 'Stress', en: 'Stress' },
      { id: 'Həyəcan', az: 'Həyəcan', en: 'Anxiety' },
      { id: 'Depressiya', az: 'Depressiya', en: 'Depression' },
      { id: 'Yuxu', az: 'Yuxu', en: 'Sleep' },
      { id: 'Saxlanılmışlar', az: '🔖 Saxlanılmışlar', en: '🔖 Saved' },
    ];

    const filteredArticles = ARTICLES.filter(a => {
      const matchCat = resourceFilter === 'Hamısı'
        ? true
        : resourceFilter === 'Saxlanılmışlar'
        ? savedArticles.includes(a.id)
        : a.category === resourceFilter;

      const matchSearch = resourceSearch === '' ||
        a.titleAz.toLowerCase().includes(resourceSearch.toLowerCase()) ||
        a.titleEn.toLowerCase().includes(resourceSearch.toLowerCase());

      return matchCat && matchSearch;
    });

    const openArticle = (article: any) => {
      setSelectedArticle(article);
      setReadArticles(prev =>
        prev.includes(article.id) ? prev : [...prev, article.id]
      );
    };

    const toggleSave = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setSavedArticles(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    };

    return (
      <div className="p-4 space-y-6 pb-32">

        {/* Başlıq */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">{t("Psixoloji Kitabxana", "Psychological Library")}</h2>
          <div className="w-10 h-10 rounded-full bg-teal-brand/10 flex items-center justify-center text-teal-brand">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Axtarış */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
          <Search size={16} className="opacity-30 shrink-0" />
          <input
            type="text"
            value={resourceSearch}
            onChange={e => setResourceSearch(e.target.value)}
            placeholder={t("Məqalə axtar...", "Search articles...")}
            className="bg-transparent border-none outline-none text-xs w-full font-bold placeholder:opacity-30"
          />
          {resourceSearch && (
            <button onClick={() => setResourceSearch('')} className="opacity-40 shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Kateqoriyalar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all active:scale-95 ${
                resourceFilter === cat.id
                  ? 'bg-teal-brand text-navy shadow-lg shadow-teal-brand/20'
                  : 'bg-white/5 border border-white/5 opacity-50'
              }`}
              onClick={() => setResourceFilter(cat.id)}
            >
              {t(cat.az, cat.en)}
            </button>
          ))}
        </div>

        {/* Featured — yalnız axtarış/filter yoxdursa */}
        {resourceFilter === 'Hamısı' && resourceSearch === '' && (
          <div
            onClick={() => openArticle(ARTICLES[0])}
            className="relative h-48 rounded-[32px] overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform"
          >
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
              alt="Featured"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 bg-teal-brand text-navy text-[9px] font-black rounded-full uppercase tracking-widest">
                {t("Günün Tövsiyəsi", "Daily Pick")}
              </span>
              <h3 className="text-lg font-black mt-2 leading-tight">
                {t("Gündəlik 5 dəqiqə meditasiyanın faydaları", "Benefits of 5-minute daily meditation")}
              </h3>
            </div>
          </div>
        )}

        {/* Məqalə siyahısı */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1 flex items-center gap-2">
            {t("SON MƏQALƏLƏR", "LATEST ARTICLES")}
            <span className="text-teal-brand normal-case tracking-normal">({filteredArticles.length})</span>
          </h3>

          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center space-y-2 opacity-30">
              <p className="text-3xl">📚</p>
              <p className="text-xs font-black">{t("Məqalə tapılmadı", "No articles found")}</p>
            </div>
          ) : (
            filteredArticles.map((article: any, idx: number) => (
              <div
                key={article.id}
                onClick={() => openArticle(article)}
                className="flex gap-4 p-3 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group active:scale-[0.98]"
              >
                {/* Şəkil */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 ring-1 ring-white/10 relative">
                  <img
                    src={article.img}
                    alt={article.titleAz}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  {readArticles.includes(article.id) && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <CheckCircle size={20} className="text-teal-brand" />
                    </div>
                  )}
                </div>

                {/* Mətn */}
                <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                  <span className="text-[9px] font-black text-teal-brand uppercase tracking-widest">
                    {t(article.category, article.category)}
                  </span>
                  <h4 className="text-[13px] font-black leading-tight line-clamp-2">
                    {t(article.titleAz, article.titleEn)}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-[9px] font-bold opacity-30">
                      <Clock size={10} />
                      <span>{article.time} {t("dəq", "min")}</span>
                    </div>
                    <button
                      onClick={(e) => toggleSave(e, article.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        savedArticles.includes(article.id)
                          ? 'text-teal-brand'
                          : 'opacity-20 hover:opacity-60'
                      }`}
                    >
                      <Bookmark size={14} fill={savedArticles.includes(article.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Video / Podcast */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.open('https://www.youtube.com/results?search_query=psixologiya+azerbaycan', '_blank')}
            className="p-5 rounded-[32px] bg-teal-brand/10 border border-teal-brand/20 space-y-3 text-left active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-brand flex items-center justify-center text-navy shadow-lg shadow-teal-brand/20">
              <Video size={18} />
            </div>
            <h4 className="text-[12px] font-black">{t("Video Dərslər", "Video Lessons")}</h4>
            <p className="text-[9px] font-bold opacity-50">{t("YouTube-da aç", "Open on YouTube")}</p>
          </button>

          <button
            onClick={() => window.open('https://open.spotify.com/search/psixologiya', '_blank')}
            className="p-5 rounded-[32px] bg-orange-brand/10 border border-orange-brand/20 space-y-3 text-left active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-brand flex items-center justify-center text-white shadow-lg shadow-orange-brand/20">
              <Mic size={18} />
            </div>
            <h4 className="text-[12px] font-black">{t("Podkastlar", "Podcasts")}</h4>
            <p className="text-[9px] font-bold opacity-50">{t("Spotify-da aç", "Open on Spotify")}</p>
          </button>
        </div>

      </div>
    );
  };

  const renderSessions = () => {
    const listToFilter = homeCategory === 'ai' ? PSYCHOLOGISTS : REAL_PSYCHOLOGISTS;
    const filteredPsychs = listToFilter.filter(p => {
      const search = psychSearch.toLowerCase();
      const name = (lang === 'az' ? p.nameAz : p.nameEn).toLowerCase();
      const specialty = (lang === 'az' ? p.specialtyAz : p.specialtyEn).toLowerCase();
      return name.includes(search) || specialty.includes(search);
    });

    return (
      <div className="flex flex-col min-h-full bg-[#0A0C10] text-[#E6EDF3]">
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

        <div className="flex-1 p-5 space-y-8 pb-32">
          {/* Active Sessions - Collapsible/Minified */}
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
          <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 relative">
            <button 
              onClick={() => { setHomeCategory('ai'); setPsychSearch(''); }}
              className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all z-10 ${homeCategory === 'ai' ? 'text-navy' : 'text-white/40'}`}
            >
              {t("🤖 AI DOSTLAR", "🤖 AI BUDDIES")}
            </button>
            <button 
              onClick={() => { setHomeCategory('real'); setPsychSearch(''); }}
              className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all z-10 ${homeCategory === 'real' ? 'text-navy' : 'text-white/40'}`}
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text"
              value={psychSearch}
              onChange={(e) => setPsychSearch(e.target.value)}
              placeholder={t("Ad və ya ixtisas üzrə axtar...", "Search by name or specialty...")}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-teal-brand/50 transition-colors"
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
                  className={`p-4 rounded-[32px] glass glass-dark bg-white/5 border border-white/5 flex items-center gap-4 hover:border-teal-brand/20 transition-colors group`}
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
                            onClick={() => {
                              setSelectedPsychForBooking(p);
                              setIsBookingModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-orange-brand text-white text-[10px] font-black shadow-lg shadow-orange-brand/20 active:scale-95 transition-transform uppercase tracking-wider"
                          >
                            {t("Qəbula yazıl", "Book Session")}
                          </button>
                        )}
                        {homeCategory === 'real' && p.price && (
                          <span className="text-[10px] font-black opacity-50">₼ {p.price}/seans</span>
                        )}
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-[9px] font-black opacity-30">
                        <Clock size={10} />
                        {homeCategory === 'ai' ? '24/7' : '10:00 - 18:00'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-4xl">
                  🔍
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black opacity-60">{t("Psixoloq tapılmadı", "No psychologist found")}</h3>
                  <p className="text-[10px] font-bold opacity-30">{t("Axtarış meyarlarını dəyişməyə çalışın", "Try changing your search criteria")}</p>
                </div>
              </motion.div>
            )}
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
  };

  const renderSettings = () => (
    <div className="p-4 space-y-6 relative">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xs bg-[#161B22] rounded-[32px] p-8 border border-white/10 text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto text-4xl">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black">{t("Əminsiniz?", "Are you sure?")}</h3>
                <p className="text-xs font-bold opacity-40 leading-relaxed">
                  {t("Hesabınızı sildikdə bütün məlumatlarınız və tarixçəniz həmişəlik itəcək.", 
                     "Deleting your account will permanently erase all your data and history.")}
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    // Logic to delete account would go here
                    setShowDeleteModal(false);
                    alert(t("Hesab silindi.", "Account deleted."));
                  }}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-[0.1em] active:scale-95 transition-transform"
                >
                  {t("Bəli, Sil", "Yes, Delete")}
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 text-xs font-black opacity-50 active:scale-95 transition-transform"
                >
                  {t("Ləğv et", "Cancel")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <h2 className="text-[14px] font-black uppercase tracking-widest text-teal-brand leading-none mb-4 px-1">{t("Parametrlər", "Settings")}</h2>

      <div className="space-y-3">
        <button 
          onClick={() => setActiveTab('feedback')}
          className="w-full flex items-center justify-between p-4 rounded-3xl glass glass-dark bg-white/5 border border-white/10 hover:border-teal-brand/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-brand/20 flex items-center justify-center text-orange-brand">
              <MessageSquare size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black group-hover:text-orange-brand transition-colors">{t("Rəy Bildir", "Send Feedback")}</h3>
              <p className="text-[10px] font-bold opacity-40">{t("Təklif və iradlarınızı bizimlə bölüşün", "Share your suggestions and complaints")}</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-orange-brand transition-all" />
        </button>

        <button 
          onClick={() => setActiveTab('social_services')}
          className="w-full flex items-center justify-between p-4 rounded-3xl glass glass-dark bg-white/5 border border-white/10 hover:border-teal-brand/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-brand/20 flex items-center justify-center text-teal-brand">
              <Globe size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black group-hover:text-teal-brand transition-colors">{t("Sosial Xidmətlər", "Social Services")}</h3>
              <p className="text-[10px] font-bold opacity-40">{t("Dövlət və ictimai dəstək mərkəzləri", "State and public support centers")}</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-teal-brand transition-all" />
        </button>

        <button 
          onClick={() => setActiveTab('results')}
          className="w-full flex items-center justify-between p-4 rounded-3xl glass glass-dark bg-white/5 border border-white/10 hover:border-teal-brand/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
              <Sparkles size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black group-hover:text-white transition-colors">{t("Test Tarixçəsi", "Test History")}</h3>
              <p className="text-[10px] font-bold opacity-40">{t("Keçmiş testlərinizin bütün nəticələri", "All results of your past tests")}</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-white transition-all" />
        </button>
      </div>

      <div className={`p-5 rounded-3xl glass border border-teal-brand/20 ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-orange-brand flex items-center gap-2">
          <Sparkles size={12} />
          {t("ABUNƏLİK PLANLARI", "SUBSCRIPTION PLANS")}
        </h4>
        <div className="space-y-3">
          {[
            { id: 'free', name: "Free", price: "0 AZN", trial: "1 Month Trial", limits: t("Gündəlik 5 mesaj", "5 messages daily") },
            { id: 'student', name: "Student", price: "4.99 AZN", trial: null, limits: t("Limitsiz AI, Tələbə dəstəyi", "Unlimited AI, Student support") },
            { id: 'pro', name: "Pro", price: "14.99 AZN", trial: null, limits: t("Hər şey limitsiz + Real Psixoloq endirimi", "Everything unlimited + Real Psych discount") },
          ].map(plan => (
            <div key={plan.id} className={`p-3 rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-navy/5 bg-navy/5'} flex items-center justify-between`}>
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-black">{plan.name}</h5>
                  {plan.id === 'free' && (
                    <span className="text-[8px] font-black bg-teal-brand/20 text-teal-brand px-1.5 py-0.5 rounded-full uppercase">{t("AKTİV", "ACTIVE")}</span>
                  )}
                </div>
                <p className="text-[9px] opacity-60 font-bold truncate">{plan.limits} {plan.trial && `(${plan.trial})`}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-black text-teal-brand">{plan.price}</span>
                {plan.id !== 'free' && (
                  <button className="px-3 py-1 rounded-lg bg-teal-brand text-navy text-[9px] font-black active:scale-95 transition-transform uppercase">
                    {t("Seç", "Select")}
                  </button>
                )}
              </div>
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

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-between p-4 rounded-3xl group mt-4 text-red-400"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-400/20 flex items-center justify-center">
              <ExternalLink size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black">{t("Çıxış", "Sign Out")}</h3>
              <p className="text-[10px] font-bold opacity-40">{user?.email}</p>
            </div>
          </div>
        </button>
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

      <button 
        onClick={() => setShowDeleteModal(true)}
        className="w-full py-4 text-[10px] font-black text-red-500/60 uppercase tracking-[0.4em] hover:text-red-500 transition-all duration-300"
      >
        {t("HESABI SİL", "DELETE ACCOUNT")}
      </button>

      {/* Footer */}
      <div className="text-center py-6 space-y-1">
        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Aidly v1.0.0</p>
        <p className="text-[8px] font-bold opacity-20 uppercase tracking-[0.3em]">{t("Made in Azerbaijan", "Made in Azerbaijan")}</p>
      </div>
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

      <div className="app-wrapper z-10">
        <div className={`app-container ${theme === 'dark' ? 'bg-[#0A0C10]' : 'bg-[#F8FAFF]'}`}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col relative overflow-hidden"
          >
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32 scrollbar-hide">
              <AnimatePresence>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-full"
                >
                  {activeTab === 'home' && renderHome()}
                  {activeTab === 'test' && renderTest()}
                  {activeTab === 'results' && renderResults()}
                  {activeTab === 'sessions' && renderSessions()}
                  {activeTab === 'settings' && renderSettings()}
                  {activeTab === 'feedback' && renderFeedback()}
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
                  className="flex flex-col items-center gap-1 relative px-3 py-1"
                >
                  <div className={`flex flex-col items-center gap-1 z-10 transition-all duration-300 ${activeTab === item.id ? 'text-teal-brand scale-110' : 'opacity-30'}`}>
                    <item.icon size={16} />
                    <span className="text-[7px] font-black uppercase tracking-tighter text-center">{item.label}</span>
                  </div>
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-teal-brand/10 dark:bg-teal-brand/20 rounded-2xl z-0"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    >
                      <motion.div 
                        className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-teal-brand rounded-full"
                        layoutId="activeTabUnderline"
                      />
                    </motion.div>
                  )}
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

            {/* MODALS & OVERLAYS */}
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
                    className={`w-full h-[95%] rounded-t-[40px] flex flex-col shadow-2xl relative glass ${theme === 'dark' ? 'glass-dark bg-navy/95 border-t border-white/20' : 'glass-light bg-white/95 border-t border-navy/10'}`}
                  >
                    {/* Chat Header */}
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
                            setIsAiVoiceEnabled(!isAiVoiceEnabled);
                            localStorage.setItem('aidly_voice_enabled', String(!isAiVoiceEnabled));
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAiVoiceEnabled ? 'bg-teal-brand text-navy' : 'bg-white/5'}`}
                        >
                          {isAiVoiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        </button>
                        <button 
                          onClick={() => setIsChatOpen(false)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-teal-brand text-navy rounded-tr-none' 
                              : theme === 'dark' ? 'bg-white/5 text-white rounded-tl-none border border-white/5' : 'bg-navy/5 text-navy rounded-tl-none border border-navy/5'
                          }`}>
                            {msg.content}
                            {msg.detectedEmotion && (
                              <div className={`mt-2 pt-2 border-t text-[8px] font-black uppercase tracking-widest ${
                                msg.detectedEmotion === 'crisis' || msg.detectedEmotion === 'böhran' 
                                  ? 'text-red-400 border-red-500/20 animate-pulse font-black' 
                                  : 'border-black/5 opacity-50'
                              }`}>
                                {t("Hiss olunan", "Detected")}: {msg.detectedEmotion}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className={`p-3 px-4 rounded-3xl ${theme === 'dark' ? 'bg-white/5' : 'bg-navy/5'} flex items-center gap-2 border border-white/5`}>
                            <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">{t("Yazır...", "Typing...")}</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-teal-brand rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                              <div className="w-1 h-1 bg-teal-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              <div className="w-1 h-1 bg-teal-brand rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 pb-8 border-t border-navy/5 dark:border-white/5">
                      <div className="relative">
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
                          className={`absolute right-1 top-1 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${inputText.trim() ? 'bg-teal-brand text-navy shadow-lg' : 'bg-white/5 text-white/20'}`}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BOOKING MODAL */}
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
                          <img src={selectedPsychForBooking.avatar} className="w-16 h-16 rounded-full mx-auto border-2 border-teal-brand/40 shadow-xl" referrerPolicy="no-referrer" />
                          <div className="space-y-0.5">
                            <h2 className="text-sm font-black">{lang === 'az' ? selectedPsychForBooking.nameAz : selectedPsychForBooking.nameEn}</h2>
                            <p className="text-[9px] font-bold text-teal-brand uppercase tracking-widest">{lang === 'az' ? selectedPsychForBooking.specialtyAz : selectedPsychForBooking.specialtyEn}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                              <Calendar size={10} />
                              {t("GÜN SEÇİN", "SELECT DAY")}
                            </h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                              {getNextDates(14).map((d, i) => {
                                const isSelected = selectedDateForBooking.toDateString() === d.toDateString();
                                return (
                                  <motion.button
                                    key={i}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDateForBooking(d)}
                                    className={`shrink-0 w-16 p-3 rounded-2xl flex flex-col items-center gap-1 transition-all border ${isSelected ? 'bg-teal-brand text-navy border-teal-brand shadow-lg scale-105' : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100'}`}
                                  >
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                                      {d.toLocaleDateString(lang === 'az' ? 'az-AZ' : 'en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-sm font-black leading-none">{d.getDate()}</span>
                                    <span className="text-[7px] font-bold opacity-60 leading-none">
                                      {d.toLocaleDateString(lang === 'az' ? 'az-AZ' : 'en-US', { month: 'short' })}
                                    </span>
                                  </motion.button>
                                );
                              })}
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
                                  whileTap={{ scale: 0.95 }}
                                  className={`py-2 rounded-xl text-[10px] font-black transition-all glass ${theme === 'dark' ? 'glass-dark bg-white/5 border-none' : 'glass-light bg-navy/5 border-none hover:bg-teal-brand/10'}`}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </div>
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
              </motion.div>
                
          {/* Home Indicator Style Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/10 rounded-full z-[120] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

