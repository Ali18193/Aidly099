import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Phone, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { SERVICES_DATA, EMERGENCY_SERVICES } from '../../constants';

interface SocialServicesViewProps {
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  setActiveTab: (tab: any) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  selectedService: any;
  setSelectedService: (val: any) => void;
  findNearestDOSTCenter: () => void;
}

export const SocialServicesView: React.FC<SocialServicesViewProps> = ({
  theme,
  lang,
  t,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedService,
  setSelectedService,
  findNearestDOSTCenter
}) => {
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

  const openWebsite = (site: string) => {
    window.open(`https://${site}`, '_blank');
  };

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex flex-col min-h-full pb-24">
      
      {/* Modal — Ətraflı məlumat */}
      {selectedService && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={() => setSelectedService(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg rounded-t-[32px] p-6 space-y-5 border pb-10 ${theme === 'dark' ? 'bg-[#161B22] border-white/10' : 'bg-white border-navy/10'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Üst çubuq */}
            <div className={`w-10 h-1 rounded-full mx-auto ${theme === 'dark' ? 'bg-white/20' : 'bg-navy/20'}`} />

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
      <div className={`px-5 py-4 flex items-center gap-3 sticky top-0 backdrop-blur-xl z-50 border-b ${theme === 'dark' ? 'bg-[#0D1117]/90 border-white/5' : 'bg-white/90 border-navy/5'}`}>
        <button
          onClick={() => setActiveTab('home')}
          className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-brand/10 transition-colors active:scale-95 ${theme === 'dark' ? 'bg-white/5' : 'bg-navy/5'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black tracking-tighter">{t("Sosial Xidmətlər", "Social Services")}</h2>
      </div>

      <div className="p-5 space-y-6">
        {/* Axtarış */}
        <div className={`flex items-center gap-3 p-4 rounded-3xl border transition-all focus-within:border-teal-brand/40 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'}`}>
          <Search size={18} className="opacity-30 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Xidmət, qurum və ya mövzu axtar...", "Search service, agency or topic...")}
            className="bg-transparent border-none outline-none text-xs w-full font-bold placeholder:opacity-30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="opacity-40 hover:opacity-80 transition-opacity shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtrlər */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 md:flex-wrap md:overflow-visible">
          {filters.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-4 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all border active:scale-95 ${
                activeFilter === chip.id
                  ? 'bg-teal-brand text-navy border-teal-brand shadow-lg shadow-teal-brand/20'
                  : theme === 'dark' ? 'bg-white/5 text-white/40 border-white/5 hover:border-white/10' : 'bg-navy/5 text-navy/40 border-navy/5 hover:border-navy/10'
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { az: "Pensiya sənədləri", en: "Pension docs", icon: "📋" },
              { az: "Əlillik qeydiyyatı", en: "Disability reg", icon: "💊" },
              { az: "Uşaq müavinəti", en: "Child benefits", icon: "👶" },
              { az: "İş axtarışı", en: "Job search", icon: "💼" }
            ].map((s, idx) => (
              <div key={idx} className={`p-2.5 rounded-xl flex items-center gap-3 text-[10px] font-bold opacity-70 ${theme === 'dark' ? 'bg-white/5' : 'bg-navy/5'}`}>
                <span>{s.icon}</span>
                <span>{t(s.az, s.en)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={findNearestDOSTCenter}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.length === 0 ? (
              <div className="col-span-full py-10 text-center opacity-30">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-xs font-bold">{t("Nəticə tapılmadı", "No results found")}</p>
              </div>
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-3xl border space-y-4 active:scale-[0.99] transition-transform cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-navy/5 border-navy/5'}`}
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialServicesView;
