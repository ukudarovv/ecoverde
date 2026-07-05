import { useState } from "react";
import {
  Sun, Wind, Battery, Users, TrendingDown, MapPin,
  CheckCircle2, Menu, X, ArrowRight, Phone, Mail,
  Shield, BarChart3, Zap, Globe, Layers, Award, Linkedin,
} from "lucide-react";
import logoImg from "@/imports/ecoverde_logo.png";
import { ContactForm } from "./components/ContactForm";

// ─── Brand colours ────────────────────────────────────────────────────────────
const C = {
  navy: "#00336E",
  green: "#009933",
  accentGreen: "#39AA50",
  white: "#FFFFFF",
  lightBg: "#F5F8F6",
  softBlueGray: "#BBCAD5",
  textDark: "#1B2633",
  textMuted: "#5F6B76",
  borderLight: "#E3E9E5",
  footerBg: "#00361F",
};

const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "ecoverde_bot";

const HERO_IMG =
  "https://images.unsplash.com/photo-1762381157166-f51ac99ab412?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// ─── Language types ────────────────────────────────────────────────────────────
type Lang = "RU" | "EN" | "KZ";

// ─── Full translations ────────────────────────────────────────────────────────
const T = {
  RU: {
    tagline: "Чистая энергия. Долговечная ценность.",
    nav: ["О проекте", "Потенциал", "Преимущества", "Инвесторам", "Партнёрам", "Контакты"],
    navIds: ["about", "potential", "why", "investors", "partners", "contacts"],
    contact: "Связаться с нами",
    heroLabel: "Возобновляемая энергия для устойчивого будущего",
    heroH1a: "Чистая энергия.",
    heroH1b: "Долговечная ценность.",
    heroDesc:
      "EcoVerde реализует проект по производству чистой электроэнергии, способствуя энергетическому переходу Казахстана и создавая ценность для инвесторов, партнёров и будущих поколений.",
    heroCta1: "Узнать больше о проекте",
    heroCta2: "Для инвесторов",
    features: [
      { title: "Чистая энергия", desc: "Солнечная и ветровая генерация с нулевым углеродным следом и минимальным воздействием на экосистему." },
      { title: "Надёжность", desc: "Диверсифицированный портфель технологий ВИЭ обеспечивает стабильную выработку в любых погодных условиях." },
      { title: "Долгосрочная ценность", desc: "Долгосрочные контракты и растущий рынок зелёной энергии создают устойчивую финансовую модель." },
    ],
    potentialLabel: "Потенциал проекта",
    potential: [
      { value: "10+ МВт", label: "первичная установленная мощность" },
      { value: "Ветер и солнце", label: "оптимальное сочетание технологий" },
      { value: "Накопление", label: "повышение надёжности электроснабжения" },
      { value: "Пром. клиенты", label: "доступ к корпоративному рынку зелёной энергии" },
      { value: "Снижение CO₂", label: "экологичный вклад в устойчивое развитие" },
      { value: "Атырауская обл.", label: "один из ключевых энергетических регионов Казахстана" },
    ],
    whyLabel: "Почему EcoVerde?",
    whyH2: "Преимущества проекта",
    why: [
      { title: "Стратегическая локация", desc: "Благоприятные природные условия и развитая энергетическая инфраструктура Атырауской области." },
      { title: "Привлекательный рынок", desc: "Рост спроса на электроэнергию, поддержка ВИЭ и высокий интерес к зелёной энергии." },
      { title: "Сильная экономика проекта", desc: "Конкурентная LCOE, доступ к финансированию и долгосрочные контракты с промышленными потребителями." },
      { title: "Масштабируемость", desc: "Возможность поэтапного расширения мощности и внедрения систем накопления энергии." },
      { title: "Опытная команда", desc: "Профессиональная команда с фокусом на качество, соблюдение сроков и долгосрочные партнёрства." },
      { title: "Прозрачность и управление", desc: "Международные стандарты корпоративного управления и экологической ответственности (ESG)." },
    ],
    invLabel: "Для инвесторов и партнёров",
    invH2: "Строим будущее вместе",
    invDesc: "Мы открыты к сотрудничеству и приглашаем инвесторов, EPC-партнёров, технологические компании и финансовые организации принять участие в реализации проекта EcoVerde.",
    invCta1: "Связаться с нами",
    invCta2: "Скачать презентацию",
    partnerTypes: ["Участие в капитале", "Совместное предприятие", "EPC-сотрудничество", "Технологические партнёрства", "Долгосрочное проектное финансирование"],
    siteLabel: "Потенциальный участок",
    siteH2: "Атырау, Республика Казахстан",
    siteDesc: "В черте города Атырау доступен потенциальный участок площадью 13 гектаров, подходящий для строительства солнечной электростанции с возможностью дальнейшего масштабирования.",
    siteArea: "13 гектаров",
    siteCity: "в черте города Атырау",
    sitePin: "Атырау, Казахстан",
    footerNavTitle: "Навигация",
    footerContactsTitle: "Контакты",
    footerFollowTitle: "Следите за нами",
    footerAbout: "Мы создаём устойчивые энергетические активы сегодня — ради лучшего завтра.",
    footerCopyright: "© 2024 EcoVerde. Все права защищены.",
    footerPrivacy: "Политика конфиденциальности",
    footerTerms: "Условия использования",
    form: {
      title: "Обратная связь",
      name: "Имя",
      email: "Email",
      phone: "Телефон",
      company: "Компания",
      telegram: "Telegram",
      message: "Сообщение",
      submit: "Отправить заявку",
      sending: "Отправка...",
      success: "Спасибо! Ваша заявка принята.",
      successPendingBot: "Заявка принята. Для подтверждения в Telegram сначала нажмите /start у бота @bot.",
      error: "Не удалось отправить заявку. Попробуйте позже.",
      required: "Обязательное поле",
      invalidEmail: "Введите корректный email",
      telegramHint: "Для подтверждения в Telegram сначала запустите бота @bot и нажмите /start",
    },
  },
  EN: {
    tagline: "Clean Energy. Lasting Value.",
    nav: ["About", "Potential", "Advantages", "Investors", "Partners", "Contacts"],
    navIds: ["about", "potential", "why", "investors", "partners", "contacts"],
    contact: "Contact Us",
    heroLabel: "Renewable Energy for a Sustainable Future",
    heroH1a: "Clean Energy.",
    heroH1b: "Lasting Value.",
    heroDesc:
      "EcoVerde is developing a clean electricity generation project, supporting Kazakhstan's energy transition and creating value for investors, partners, and future generations.",
    heroCta1: "Learn More About the Project",
    heroCta2: "For Investors",
    features: [
      { title: "Clean Energy", desc: "Solar and wind generation with zero carbon footprint and minimal environmental impact." },
      { title: "Reliability", desc: "A diversified portfolio of renewable energy technologies ensures stable output in any weather conditions." },
      { title: "Long-Term Value", desc: "Long-term contracts and a growing green energy market create a sustainable financial model for investors." },
    ],
    potentialLabel: "Project Potential",
    potential: [
      { value: "10+ MW", label: "initial installed capacity" },
      { value: "Wind & Solar", label: "optimal technology mix" },
      { value: "Storage", label: "enhanced power supply reliability" },
      { value: "Industrial Clients", label: "access to corporate green energy market" },
      { value: "CO₂ Reduction", label: "ecological contribution to regional sustainability" },
      { value: "Atyrau Region", label: "one of Kazakhstan's key energy regions" },
    ],
    whyLabel: "Why EcoVerde?",
    whyH2: "Project Advantages",
    why: [
      { title: "Strategic Location", desc: "Favorable natural conditions and developed energy infrastructure of the Atyrau region." },
      { title: "Attractive Market", desc: "Growing electricity demand, renewable energy support policy, and strong interest in green energy." },
      { title: "Strong Project Economics", desc: "Competitive LCOE, access to financing, and long-term contracts with industrial consumers." },
      { title: "Scalability", desc: "Phased capacity expansion and integration of energy storage systems." },
      { title: "Experienced Team", desc: "Professional team focused on quality, meeting deadlines, and long-term partnerships." },
      { title: "Transparency & Governance", desc: "International corporate governance and environmental responsibility standards (ESG)." },
    ],
    invLabel: "For Investors & Partners",
    invH2: "Building the Future Together",
    invDesc: "We welcome collaboration and invite investors, EPC partners, technology companies, and financial institutions to participate in the EcoVerde project.",
    invCta1: "Contact Us",
    invCta2: "Download Presentation",
    partnerTypes: ["Equity Participation", "Joint Venture", "EPC Cooperation", "Technology Partnerships", "Long-Term Project Financing"],
    siteLabel: "Potential Site",
    siteH2: "Atyrau, Republic of Kazakhstan",
    siteDesc: "Within the city limits of Atyrau, a potential site of 13 hectares is available, suitable for a solar power plant with the possibility of further scaling.",
    siteArea: "13 hectares",
    siteCity: "within the city of Atyrau",
    sitePin: "Atyrau, Kazakhstan",
    footerNavTitle: "Navigation",
    footerContactsTitle: "Contacts",
    footerFollowTitle: "Follow Us",
    footerAbout: "We build sustainable energy assets today — for a better tomorrow.",
    footerCopyright: "© 2024 EcoVerde. All rights reserved.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    form: {
      title: "Contact Form",
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      telegram: "Telegram",
      message: "Message",
      submit: "Submit Request",
      sending: "Sending...",
      success: "Thank you! Your request has been received.",
      successPendingBot: "Request received. To get Telegram confirmation, start the bot @bot and press /start first.",
      error: "Failed to submit the form. Please try again later.",
      required: "Required field",
      invalidEmail: "Enter a valid email",
      telegramHint: "For Telegram confirmation, start the bot @bot and press /start first",
    },
  },
  KZ: {
    tagline: "Таза энергия. Ұзаққа созылатын құндылық.",
    nav: ["Жоба туралы", "Потенциал", "Артықшылықтар", "Инвесторларға", "Серіктестерге", "Байланыс"],
    navIds: ["about", "potential", "why", "investors", "partners", "contacts"],
    contact: "Бізбен байланысыңыз",
    heroLabel: "Тұрақты болашақ үшін жаңартылатын энергия",
    heroH1a: "Таза энергия.",
    heroH1b: "Ұзаққа созылатын құндылық.",
    heroDesc:
      "EcoVerde таза электр энергиясын өндіру жобасын іске асырады, Қазақстанның энергетикалық өтпелі кезеңіне үлес қосады және инвесторлар, серіктестер мен болашақ ұрпақтар үшін құндылық жасайды.",
    heroCta1: "Жоба туралы толығырақ",
    heroCta2: "Инвесторларға",
    features: [
      { title: "Таза энергия", desc: "Нөлдік көміртек ізімен және экожүйеге минималды әсерімен күн мен жел генерациясы." },
      { title: "Сенімділік", desc: "ЖЭК технологияларының әртараптандырылған портфолиосы кез келген ауа-райында тұрақты өнім береді." },
      { title: "Ұзақмерзімді құндылық", desc: "Ұзақмерзімді келісімшарттар мен жасыл энергия нарығының өсуі инвесторлар үшін тұрақты қаржы моделін қалыптастырады." },
    ],
    potentialLabel: "Жоба потенциалы",
    potential: [
      { value: "10+ МВт", label: "бастапқы орнатылған қуат" },
      { value: "Жел және күн", label: "технологиялардың оңтайлы үйлесімі" },
      { value: "Жинақтау", label: "электрмен жабдықтаудың сенімділігін арттыру" },
      { value: "Өнеркәсіп клиенттері", label: "жасыл энергияның корпоративтік нарығына шығу" },
      { value: "CO₂ азайту", label: "аймақтың тұрақты дамуына экологиялық үлес" },
      { value: "Атырау облысы", label: "Қазақстанның негізгі энергетикалық аймақтарының бірі" },
    ],
    whyLabel: "Неліктен EcoVerde?",
    whyH2: "Жоба артықшылықтары",
    why: [
      { title: "Стратегиялық орналасу", desc: "Атырау облысының қолайлы табиғи жағдайлары мен дамыған энергетикалық инфрақұрылымы." },
      { title: "Тартымды нарық", desc: "Электр энергиясына деген сұраныстың өсуі, ЖЭК-ті дамытуға қолдау және жасыл энергияға деген жоғары қызығушылық." },
      { title: "Жобаның күшті экономикасы", desc: "Бәсекелі LCOE, қаржыландыруға қолжетімділік және өнеркәсіптік тұтынушылармен ұзақмерзімді келісімшарттар." },
      { title: "Ауқымдылық", desc: "Қуатты кезең-кезеңімен кеңейту және энергия жинақтау жүйелерін енгізу мүмкіндігі." },
      { title: "Тәжірибелі команда", desc: "Сапаға, мерзімдерді сақтауға және ұзақмерзімді серіктестіктерге бағытталған кәсіби команда." },
      { title: "Ашықтық және басқару", desc: "Корпоративтік басқару мен экологиялық жауапкершіліктің халықаралық стандарттары (ESG)." },
    ],
    invLabel: "Инвесторлар мен серіктестерге",
    invH2: "Бірге болашақ құрамыз",
    invDesc: "Біз ынтымақтастыққа ашықпыз және инвесторларды, EPC-серіктестерді, технологиялық компанияларды және қаржы ұйымдарын EcoVerde жобасын іске асыруға шақырамыз.",
    invCta1: "Бізбен байланысыңыз",
    invCta2: "Презентацияны жүктеу",
    partnerTypes: ["Капиталға қатысу", "Бірлескен кәсіпорын", "EPC-ынтымақтастық", "Технологиялық серіктестіктер", "Ұзақмерзімді жобалық қаржыландыру"],
    siteLabel: "Болашақ учаске",
    siteH2: "Атырау, Қазақстан Республикасы",
    siteDesc: "Атырау қаласының шегінде күн электр станциясын салуға және одан әрі кеңейтуге жарамды 13 гектар потенциалды учаске бар.",
    siteArea: "13 гектар",
    siteCity: "Атырау қаласының шегінде",
    sitePin: "Атырау, Қазақстан",
    footerNavTitle: "Навигация",
    footerContactsTitle: "Байланыс",
    footerFollowTitle: "Бізді бақылаңыз",
    footerAbout: "Біз бүгін тұрақты энергетикалық активтер жасаймыз — ертеңгі күн үшін.",
    footerCopyright: "© 2024 EcoVerde. Барлық құқықтар қорғалған.",
    footerPrivacy: "Құпиялылық саясаты",
    footerTerms: "Пайдалану шарттары",
    form: {
      title: "Кері байланыс",
      name: "Аты",
      email: "Email",
      phone: "Телефон",
      company: "Компания",
      telegram: "Telegram",
      message: "Хабарлама",
      submit: "Өтініш жіберу",
      sending: "Жіберілуде...",
      success: "Рахмет! Сіздің өтінішіңіз қабылданды.",
      successPendingBot: "Өтініш қабылданды. Telegram растауы үшін алдымен @bot ботында /start басыңыз.",
      error: "Өтініш жіберу сәтсіз аяқталды. Кейінірек қайталап көріңіз.",
      required: "Міндетті өріс",
      invalidEmail: "Дұрыс email енгізіңіз",
      telegramHint: "Telegram растауы үшін алдымен @bot ботын іске қосып, /start басыңыз",
    },
  },
} as const;

// ─── EcoVerde leaf mark (watermark) ──────────────────────────────────────────
function EcoMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden>
      <path d="M150 30 C195 10 260 30 270 80 C280 130 240 170 190 160 C160 155 140 130 150 30Z" fill="currentColor" />
      <path d="M150 30 C105 10 40 30 30 80 C20 130 60 170 110 160 C140 155 160 130 150 30Z" fill="currentColor" opacity="0.8" />
      <path d="M110 160 C60 180 40 230 70 270 C100 310 150 320 180 290 C210 260 210 210 190 160 C170 150 130 150 110 160Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Overline({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: C.green }}>{children}</p>;
}

function Section({ children, bg = C.white, id }: { children: React.ReactNode; bg?: string; id?: string }) {
  return (
    <section id={id} className="py-24" style={{ background: bg }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">{children}</div>
    </section>
  );
}

function GreenLine() {
  return <div className="w-12 h-0.5 rounded-full mt-4 mb-12 mx-auto" style={{ background: C.green }} />;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ lang, setLang, t }: { lang: Lang; setLang: (l: Lang) => void; t: typeof T["RU"] }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white" style={{ height: 88, borderBottom: `1px solid ${C.borderLight}` }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 h-full flex items-center gap-6">
        {/* Logo — mix-blend-mode removes the black background */}
        <div className="flex-shrink-0 flex flex-col" style={{ minWidth: 160 }}>
          <img
            src={logoImg}
            alt="EcoVerde"
            className="h-14 w-auto object-contain object-left"
          />
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap" style={{ color: C.textMuted }}>
            {t.tagline}
          </span>
        </div>

        {/* Desktop nav — centered, scrolls to sections */}
        <nav className="hidden lg:flex items-center justify-center gap-6 flex-1">
          {t.nav.map((label, i) => (
            <button
              key={label}
              onClick={() => scrollTo(t.navIds[i])}
              className="text-[13px] font-medium whitespace-nowrap hover:opacity-60 transition-opacity cursor-pointer"
              style={{ color: C.textDark, background: "none", border: "none", padding: 0 }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right — language switcher + CTA */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          {/* Language switcher */}
          <div
            className="flex items-center rounded-full overflow-hidden"
            style={{ border: `1px solid ${C.borderLight}`, height: 36 }}
          >
            {(["RU", "EN", "KZ"] as Lang[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="text-[12px] font-semibold transition-colors px-3 h-full"
                style={{
                  color: lang === l ? C.white : C.textMuted,
                  background: lang === l ? C.green : "transparent",
                  borderRight: i < 2 ? `1px solid ${C.borderLight}` : "none",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => scrollTo("contacts")}
            className="text-[13px] font-semibold text-white whitespace-nowrap flex items-center cursor-pointer"
            style={{ background: C.green, height: 44, padding: "0 20px", borderRadius: 6, border: "none" }}
          >
            {t.contact}
          </button>
        </div>

        {/* Mobile burger */}
        <div className="lg:hidden flex items-center gap-3 ml-auto">
          <div className="flex items-center rounded-full overflow-hidden" style={{ border: `1px solid ${C.borderLight}` }}>
            {(["RU", "EN", "KZ"] as Lang[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="text-[11px] font-semibold px-2 py-1 transition-colors"
                style={{
                  color: lang === l ? C.white : C.textMuted,
                  background: lang === l ? C.green : "transparent",
                  borderRight: i < 2 ? `1px solid ${C.borderLight}` : "none",
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => setOpen(!open)} style={{ color: C.navy, background: "none", border: "none" }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t px-6 py-6 flex flex-col gap-4" style={{ borderColor: C.borderLight }}>
          {t.nav.map((label, i) => (
            <button
              key={label}
              onClick={() => scrollTo(t.navIds[i])}
              className="text-sm font-medium text-left"
              style={{ color: C.textDark, background: "none", border: "none", padding: 0 }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contacts")}
            className="text-sm font-semibold text-white text-center py-3 rounded mt-2"
            style={{ background: C.green, border: "none", borderRadius: 6 }}
          >
            {t.contact}
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ t, scrollTo }: { t: typeof T["RU"]; scrollTo: (id: string) => void }) {
  return (
    <div id="about" style={{ paddingTop: 88 }}>
      <div className="relative overflow-hidden" style={{ minHeight: 640, background: `linear-gradient(to right, ${C.white} 45%, ${C.lightBg} 100%)` }}>
        {/* Right photo */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
          <img src={HERO_IMG} alt="Solar and wind farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.05) 65%)" }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 lg:px-10 grid grid-cols-12 gap-6 items-center py-20" style={{ minHeight: 640 }}>
          <div className="col-span-12 lg:col-span-6">
            <p className="text-[13px] font-semibold uppercase mb-6" style={{ letterSpacing: "0.14em", color: C.green }}>
              {t.heroLabel}
            </p>
            <h1 className="font-semibold leading-[1.1] mb-6" style={{ fontSize: "clamp(36px, 4.5vw, 62px)", color: C.textDark }}>
              {t.heroH1a}
              <br />
              <span style={{ color: C.green }}>{t.heroH1b}</span>
            </h1>
            <p className="text-base leading-relaxed mb-10 max-w-lg" style={{ color: C.textMuted }}>
              {t.heroDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("potential")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white cursor-pointer"
                style={{ background: C.green, height: 52, padding: "0 28px", borderRadius: 6, border: "none" }}
              >
                {t.heroCta1} <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo("investors")}
                className="inline-flex items-center text-sm font-semibold cursor-pointer"
                style={{ height: 52, padding: "0 28px", borderRadius: 6, border: `1px solid ${C.green}`, color: C.navy, background: "transparent" }}
              >
                {t.heroCta2}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Feature cards strip ──────────────────────────────────────────────────────
const FEATURE_ICONS = [Sun, Shield, TrendingDown];

function FeatureStrip({ t }: { t: typeof T["RU"] }) {
  return (
    <div style={{ background: C.white, paddingBottom: 8 }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-12 gap-6 -mt-10 relative z-20">
          {t.features.map((item, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div
                key={i}
                className="col-span-12 sm:col-span-4"
                style={{ background: C.white, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 32, boxShadow: "0 12px 30px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center justify-center mb-5" style={{ width: 56, height: 56, borderRadius: "50%", border: "1.5px solid #BFDCC7" }}>
                  <Icon size={22} style={{ color: C.green }} strokeWidth={1.5} />
                </div>
                <h3 className="text-[18px] font-semibold mb-2" style={{ color: C.textDark }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Potential ────────────────────────────────────────────────────────────────
const POTENTIAL_ICONS = [Zap, Wind, Battery, Users, TrendingDown, MapPin];

function Potential({ t }: { t: typeof T["RU"] }) {
  return (
    <Section bg={C.white} id="potential">
      <div className="text-center">
        <Overline>{t.potentialLabel}</Overline>
        <GreenLine />
      </div>
      <div className="grid grid-cols-12">
        {t.potential.map((item, i) => {
          const Icon = POTENTIAL_ICONS[i];
          const isLast = i === t.potential.length - 1;
          const noRightBorder = i === 2 || i === 5 || isLast;
          return (
            <div
              key={i}
              className="col-span-6 md:col-span-4 lg:col-span-2 flex flex-col items-center text-center py-10 px-4"
              style={{ borderRight: noRightBorder ? "none" : `1px solid ${C.borderLight}` }}
            >
              <div className="flex items-center justify-center mb-4" style={{ width: 52, height: 52, borderRadius: "50%", border: "1.5px solid #BFDCC7", background: "#F0FAF3" }}>
                <Icon size={20} style={{ color: C.green }} strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-[15px] mb-1" style={{ color: C.textDark }}>{item.value}</p>
              <p className="text-[13px] leading-snug" style={{ color: C.textMuted }}>{item.label}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Why EcoVerde ─────────────────────────────────────────────────────────────
const WHY_ICONS = [Globe, BarChart3, TrendingDown, Layers, Award, Shield];

function Why({ t }: { t: typeof T["RU"] }) {
  return (
    <Section bg={C.lightBg} id="why">
      <div className="text-center mb-14">
        <Overline>{t.whyLabel}</Overline>
        <h2 className="font-semibold" style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.2, color: C.navy }}>{t.whyH2}</h2>
        <div className="w-12 h-0.5 rounded-full mt-4 mx-auto" style={{ background: C.green }} />
      </div>
      <div className="grid grid-cols-12 gap-6">
        {t.why.map((card, i) => {
          const Icon = WHY_ICONS[i];
          return (
            <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4" style={{ background: C.white, border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: 28, minHeight: 190, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 48, height: 48, borderRadius: "50%", border: "1.5px solid #BFDCC7", background: "#F0FAF3" }}>
                <Icon size={18} style={{ color: C.green }} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[17px] mb-2" style={{ color: C.textDark }}>{card.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: C.textMuted }}>{card.desc}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Investors ────────────────────────────────────────────────────────────────
function Investors({ t, scrollTo }: { t: typeof T["RU"]; scrollTo: (id: string) => void }) {
  return (
    <section id="investors" className="relative overflow-hidden" style={{ background: C.white }}>
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(245,248,246,0.88)" }} />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 lg:px-10 py-24">
        <div
          className="grid grid-cols-12 gap-10 items-center"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: "56px 48px" }}
        >
          <div className="col-span-12 lg:col-span-6" id="partners">
            <Overline>{t.invLabel}</Overline>
            <h2 className="font-semibold mb-5" style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.2, color: C.navy }}>{t.invH2}</h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: C.textMuted }}>{t.invDesc}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("contacts")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white cursor-pointer"
                style={{ background: C.green, height: 52, padding: "0 28px", borderRadius: 6, border: "none" }}
              >
                {t.invCta1} <ArrowRight size={15} />
              </button>
              <button
                className="inline-flex items-center text-sm font-semibold cursor-pointer"
                style={{ height: 52, padding: "0 28px", borderRadius: 6, border: `1px solid ${C.navy}`, color: C.navy, background: "transparent" }}
              >
                {t.invCta2}
              </button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <ul className="space-y-4">
              {t.partnerTypes.map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <CheckCircle2 size={20} style={{ color: C.green, flexShrink: 0 }} strokeWidth={1.75} />
                  <span className="text-[15px]" style={{ color: C.textDark }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Site Location ────────────────────────────────────────────────────────────
function SiteLocation({ t }: { t: typeof T["RU"] }) {
  return (
    <Section bg={C.white}>
      <div className="grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 lg:col-span-5">
          <Overline>{t.siteLabel}</Overline>
          <h2 className="font-semibold mb-5" style={{ fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.25, color: C.navy }}>{t.siteH2}</h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: C.textMuted }}>{t.siteDesc}</p>
          <div className="flex items-center gap-5" style={{ background: "#F0FAF3", border: "1px solid #BFDCC7", borderRadius: 12, padding: "24px 28px" }}>
            <MapPin size={28} style={{ color: C.green, flexShrink: 0 }} strokeWidth={1.5} />
            <div>
              <p className="text-3xl font-semibold" style={{ color: C.navy }}>{t.siteArea}</p>
              <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>{t.siteCity}</p>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="relative overflow-hidden flex items-center justify-center" style={{ height: 340, borderRadius: 16, background: "#EEF3F1", border: `1px solid ${C.borderLight}` }}>
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
              <defs>
                <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.softBlueGray} strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" />
            </svg>
            <svg className="absolute bottom-8 left-8 opacity-40" width="160" height="60" viewBox="0 0 160 60">
              <ellipse cx="80" cy="30" rx="80" ry="30" fill="#DCEAF2" />
            </svg>
            <svg className="absolute top-12 right-16 opacity-30" width="100" height="40" viewBox="0 0 100 40">
              <ellipse cx="50" cy="20" rx="50" ry="20" fill="#DCEAF2" />
            </svg>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: "50%", background: C.green, boxShadow: "0 0 0 10px rgba(0,153,51,0.15)" }}>
                <MapPin size={22} color="white" fill="white" strokeWidth={1} />
              </div>
              <div className="mt-3 px-4 py-2 text-sm font-semibold text-white rounded" style={{ background: C.navy, borderRadius: 6 }}>
                {t.sitePin}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ t, lang, scrollTo }: { t: typeof T["RU"]; lang: Lang; scrollTo: (id: string) => void }) {
  return (
    <footer id="contacts" className="relative overflow-hidden" style={{ background: C.footerBg }}>
      <div className="absolute right-[-6%] bottom-[-10%] pointer-events-none select-none" style={{ width: 560, height: 680 }}>
        <EcoMark className="w-full h-full" style={{ color: C.green, opacity: 0.07 }} />
      </div>
      <div className="absolute left-[-4%] top-[-8%] pointer-events-none select-none" style={{ width: 260, height: 320 }}>
        <EcoMark className="w-full h-full" style={{ color: "white", opacity: 0.03 }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 lg:px-10 py-20">
        <div
          className="grid grid-cols-12 gap-10 pb-14 mb-14"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="col-span-12 lg:col-span-5">
            <ContactForm lang={lang} labels={t.form} botUsername={BOT_USERNAME} />
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center">
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.55)" }}>
              {t.invDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10 pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Brand */}
          <div className="col-span-12 lg:col-span-4">
            <div className="inline-block bg-white rounded-xl px-4 py-2 mb-5">
              <img
                src={logoImg}
                alt="EcoVerde"
                className="h-14 w-auto object-contain object-left"
              />
            </div>
            <p className="text-sm leading-relaxed mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>{t.tagline}</p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>{t.footerAbout}</p>
            <div className="flex gap-3">
              {[Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="col-span-6 lg:col-span-3">
            <h5 className="text-xs font-semibold uppercase mb-5" style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>{t.footerNavTitle}</h5>
            <ul className="space-y-3">
              {t.nav.map((label, i) => (
                <li key={i}>
                  <button onClick={() => scrollTo(t.navIds[i])} className="text-sm text-left transition-opacity hover:opacity-80 cursor-pointer" style={{ color: "rgba(255,255,255,0.65)", background: "none", border: "none", padding: 0 }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-span-6 lg:col-span-3">
            <h5 className="text-xs font-semibold uppercase mb-5" style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>{t.footerContactsTitle}</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={14} style={{ color: C.accentGreen, marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>+7 707 777 6852</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} style={{ color: C.accentGreen, marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>ecoverdekz@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} style={{ color: C.accentGreen, marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>Atyrau, Kazakhstan</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-12 lg:col-span-2">
            <h5 className="text-xs font-semibold uppercase mb-5" style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>{t.footerFollowTitle}</h5>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: C.accentGreen }}>
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{t.footerCopyright}</p>
          <div className="flex gap-6">
            {[t.footerPrivacy, t.footerTerms].map((l) => (
              <a key={l} href="#" className="text-xs transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("RU");
  const t = T[lang];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} scrollTo={scrollTo} />
      <FeatureStrip t={t} />
      <Potential t={t} />
      <Why t={t} />
      <Investors t={t} scrollTo={scrollTo} />
      <SiteLocation t={t} />
      <Footer t={t} lang={lang} scrollTo={scrollTo} />
    </div>
  );
}
