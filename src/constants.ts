export const PSYCHOLOGISTS = [
  { id: '2', nameAz: 'Dr. Samir Qasımov', nameEn: 'Dr. Samir Gasimov', specialtyAz: 'Təşviş və Stress', specialtyEn: 'Anxiety and Stress', avatar: 'https://picsum.photos/seed/samir/100/100', rating: "4.9", chatCount: "2.3k", titleAz: 'Bəy', titleEn: 'Mr.', shortNameAz: 'Samir', shortNameEn: 'Samir', gender: 'male' },
  { id: '3', nameAz: 'Dr. Günel Sadıqova', nameEn: 'Dr. Gunel Sadiqova', specialtyAz: 'Uşaq Psixoloqu', specialtyEn: 'Child Psychologist', avatar: 'https://picsum.photos/seed/gunel/100/100', rating: "4.8", chatCount: "1.9k", titleAz: 'Xanım', titleEn: 'Ms.', shortNameAz: 'Günel', shortNameEn: 'Gunel', gender: 'female' },
  { id: '4', nameAz: 'Aydan (Tələbə Dostu)', nameEn: 'Aydan (Student Buddy)', specialtyAz: 'Tələbə və məktəblilər üçün', specialtyEn: 'For Students and Pupils', avatar: 'https://picsum.photos/seed/student/100/100', rating: "4.9", chatCount: "3.1k", titleAz: 'Xanım', titleEn: 'Ms.', shortNameAz: 'Aydan', shortNameEn: 'Aydan', gender: 'female' },
];

export const REAL_PSYCHOLOGISTS = [
  { id: 'r1', nameAz: 'Dr. Orxan Məmmədov', nameEn: 'Dr. Orkhan Mammadov', specialtyAz: 'Psixoterapevt', specialtyEn: 'Psychotherapist', avatar: 'https://picsum.photos/seed/orxan/100/100', rating: "4.7", sessionCount: "128", price: "60" },
  { id: 'r2', nameAz: 'Dr. Nigar Rzayeva', nameEn: 'Dr. Nigar Rzayeva', specialtyAz: 'Ailə Psixoloqu', specialtyEn: 'Family Psychologist', avatar: 'https://picsum.photos/seed/nigar/100/100', rating: "4.9", sessionCount: "256", price: "50" },
];

export const EMERGENCY_SERVICES = [
  { id: '1', phone: '988', nameAz: 'Milli Psixi Sağlamlıq Mərkəzi', nameEn: 'National Mental Health Center', descAz: 'Böhran və intihar riski', descEn: 'Crisis and suicide risk' },
  { id: '2', phone: '146-3', nameAz: 'Təhsil Nazirliyi', nameEn: 'Ministry of Education', descAz: 'Psixoloji dəstək', descEn: 'Psychological support' },
  { id: '3', phone: '(012) 510-66-36', nameAz: 'Psixoloji Dəstək Xətti', nameEn: 'Psychological Support Line', descAz: '24/7 anonim dəstək', descEn: '24/7 anonymous support' },
];

export const ARTICLES = [
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
    img: "https://images.unsplash.com/photo-1541123603104-512919d6a96c?auto=format&fit=crop&q=80&w=400",
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

export const QUESTIONS = [
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

export const SERVICES_DATA = [
  {
    id: 'shelters',
    az: "Sığınacaqlar",
    en: "Shelters",
    descAz: "Qadın sığınacaqları, evsizlər üçün gecə mərkəzləri",
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

export const AUDIO_RESOURCES = [
  { id: 'a1', titleAz: "Sakitləşdirici Təbiət", titleEn: "Calming Nature", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "5:00" },
  { id: 'a2', titleAz: "Dərin Meditasiya", titleEn: "Deep Meditation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "8:00" },
];

export const QUOTES = [
  { az: "Hər fırtına həyatınızı dağıtmaq üçün gəlmir, bəziləri yolunuzu təmizləmək üçün gəlir.", en: "Not every storm comes to disrupt your life, some come to clear your path." },
  { az: "Özünə qarşı mehriban olmaq, sağalmağın ilk addımıdır.", en: "Being kind to yourself is the first step to healing." },
  { az: "Sən keçmişin deyilsən, sən bu an yaratdığın insansan.", en: "You are not your past, you are the person you create in this moment." }
];
