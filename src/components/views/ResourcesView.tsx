import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  BookOpen, 
  AlertTriangle, 
  Phone, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  Video, 
  Mic, 
  MessageSquare 
} from 'lucide-react';
import { ARTICLES, EMERGENCY_SERVICES } from '../../constants';

interface ResourcesViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setActiveTab: (tab: any) => void;
  resourceFilter: string;
  setResourceFilter: (val: string) => void;
  resourceSearch: string;
  setResourceSearch: (val: string) => void;
  savedArticles: number[];
  setSavedArticles: React.Dispatch<React.SetStateAction<number[]>>;
  readArticles: number[];
  setReadArticles: React.Dispatch<React.SetStateAction<number[]>>;
  selectedArticle: any;
  setSelectedArticle: (val: any) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  theme,
  lang,
  t,
  setActiveTab,
  resourceFilter,
  setResourceFilter,
  resourceSearch,
  setResourceSearch,
  savedArticles,
  setSavedArticles,
  readArticles,
  setReadArticles,
  selectedArticle,
  setSelectedArticle
}) => {

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

  const renderArticleDetail = () => {
    const article = selectedArticle;
    if (!article) return null;
    const isSaved = savedArticles.includes(article.id);

    const handleToggleSave = () => {
      setSavedArticles(prev =>
        prev.includes(article.id)
          ? prev.filter(id => id !== article.id)
          : [...prev, article.id]
      );
    };

    return (
      <div className="flex flex-col min-h-full pb-20">
        {/* Başlıq */}
        <div className={`px-5 py-4 flex items-center gap-3 sticky top-0 backdrop-blur-xl z-50 border-b ${theme === 'dark' ? 'bg-[#0D1117]/90 border-white/5' : 'bg-white/90 border-navy/5'}`}>
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
            onClick={handleToggleSave}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isSaved ? 'bg-teal-brand/20 text-teal-brand' : (theme === 'dark' ? 'bg-white/5 opacity-40' : 'bg-navy/5 opacity-40')
            }`}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex-1">
          {/* Şəkil */}
          <div className="h-52 overflow-hidden relative">
            <img
              src={article.img}
              alt={article.titleAz}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-[#0D1117] via-[#0D1117]/30' : 'from-[#F8FAFF] via-[#F8FAFF]/30'} to-transparent`} />
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
                .map((paragraph: string, idx: number) => (
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
                  setActiveTab('sessions');
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

  if (selectedArticle) return renderArticleDetail();

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* Başlıq */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">{t("Psixoloji Kitabxana", "Psychological Library")}</h2>
        <div className="w-10 h-10 rounded-full bg-teal-brand/10 flex items-center justify-center text-teal-brand">
          <BookOpen size={20} />
        </div>
      </div>

      {/* Təcili Yardım Xətləri */}
      <div className="space-y-3">
        <h3 className="text-xs font-black opacity-50 px-1">{t("Təcili Psixoloji Yardım", "Emergency Psychological Support")}</h3>
        <div className="grid grid-cols-1 gap-3">
           {EMERGENCY_SERVICES.map(s => (
             <a href={`tel:${s.phone.replace(/[\s()-]/g, '')}`} key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-navy/5 border-navy/5'}`}>
               <div className="w-10 h-10 rounded-full bg-teal-brand flex items-center justify-center text-navy">
                 {s.id === '1' ? <AlertTriangle size={20} /> : <Phone size={20} />}
               </div>
               <div>
                 <div className="font-bold text-xs">{t(s.nameAz, s.nameEn)}</div>
                 <div className="text-[10px] opacity-60 flex items-center gap-1">
                   <span className="font-bold">{s.phone}</span> • {t(s.descAz, s.descEn)}
                 </div>
               </div>
             </a>
           ))}
        </div>
      </div>

      {/* Axtarış */}
      <div className={`flex items-center gap-3 p-3.5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'}`}>
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
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all active:scale-95 ${
              resourceFilter === cat.id
                ? 'bg-teal-brand text-navy shadow-lg shadow-teal-brand/20'
                : theme === 'dark' ? 'bg-white/5 border border-white/5 opacity-50' : 'bg-navy/5 border border-navy/5 opacity-50'
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
            referrerPolicy="no-referrer"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full py-12 text-center space-y-2 opacity-30">
              <p className="text-3xl">📚</p>
              <p className="text-xs font-black">{t("Məqalə tapılmadı", "No articles found")}</p>
            </div>
          ) : (
            filteredArticles.map((article: any) => (
              <div
                key={article.id}
                onClick={() => openArticle(article)}
                className={`flex gap-4 p-3 rounded-3xl border hover:opacity-80 transition-colors cursor-pointer group active:scale-[0.98] ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'}`}
              >
                {/* Şəkil */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 ring-1 ring-white/10 relative">
                  <img
                    src={article.img}
                    alt={article.titleAz}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
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
                      className={`text-[14px] ${savedArticles.includes(article.id) ? 'text-teal-brand' : 'opacity-20 hover:opacity-60'}`}
                    >
                      <Bookmark size={14} fill={savedArticles.includes(article.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Video / Podcast */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

export default ResourcesView;
