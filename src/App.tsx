import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { 
  Leaf, Sprout, TestTube, TrendingDown, Users, BookOpen,
  Newspaper, Mail, ChevronRight, MapPin, Calendar, FileText, ExternalLink, Menu, X,
  Target, BarChart3, Presentation, Navigation, Droplets, Zap, Camera, CheckCircle2,
  Info, AlertTriangle, Cookie
} from 'lucide-react';
import DroneCursor from './components/DroneCursor';
import MapCarousel from './components/MapCarousel';

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string, direction?: "up" | "left" | "right" }> = ({ children, delay = 0, className = "", direction = "up" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 }
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Floating: React.FC<{ children: React.ReactNode, delay?: number, duration?: number }> = ({ children, delay = 0, duration = 4 }) => (
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

/** Counts up from 0 to `to` once the number scrolls into view. */
const CountUp: React.FC<{ to: number; duration?: number; suffix?: string }> = ({ to, duration = 1.4, suffix = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    let frame: number;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setValue(Math.round(progress * to));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, to, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
};

/** Wraps children in a layer that drifts vertically as the page scrolls past it. */
const Parallax: React.FC<{ children?: React.ReactNode; speed?: number; className?: string }> = ({ children, speed = 0.15, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Check cookie consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowCookieBanner(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blocca lo scroll della pagina e permette di chiudere con Esc quando il popup del calendario è aperto
  useEffect(() => {
    if (!isCalendarOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCalendarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarOpen]);

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
    setShowCookieBanner(false);
  };

  const navLinks = [
    { name: 'Il Drone', href: '#drone' },
    { name: 'Il Progetto', href: '#progetto' },
    { name: 'Divulgazione', href: '#risultati' },
  ];

  // Prossimi eventi: aggiungete qui le date reali (vedi il vademecum condiviso).
  // Formato data: "AAAA-MM-GG". L'ordine nell'elenco non conta: vengono ordinati
  // automaticamente e quelli già passati non vengono mostrati.
  const events: { title: string; date: string; location?: string; description?: string; link?: string }[] = [
    // Esempio (rimuovere il commento e compilare per pubblicare un evento):
    // { title: "Fiera Agricola SIA", date: "2026-11-05", location: "Verona Fiere", description: "Demo dal vivo del drone in campo con il team CITIMAP.", link: "https://example.com" },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-brand-outer-bg text-brand-text font-body selection:bg-brand-light selection:text-white overflow-x-hidden">
      <DroneCursor />

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-4' : 'bg-white py-6'}`}>
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group text-brand-dark cursor-pointer">
              <img
                src="/logo-biodrone-trasparente.png"
                alt="BioDroneConsulting"
                className="h-[100px] w-auto transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </a>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`text-[15px] font-normal transition-colors relative group ${link.name === 'Home' ? 'text-brand-text' : 'text-brand-text hover:text-brand-light'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-2.5 left-0 h-[1.5px] transition-all bg-brand-light ${link.name === 'Home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-brand-text p-2 hover:bg-gray-50 rounded-full transition-colors">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl overflow-hidden z-40"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${link.name === 'Home' ? 'bg-green-50 text-brand-dark' : 'text-brand-text hover:bg-gray-50 hover:text-brand-light'}`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Styled Hero Section Container */}
      <section className="bg-white w-full pt-32 lg:pt-36 pb-0 rounded-b-[3rem] lg:rounded-b-[5rem] relative z-10 shadow-sm border-b border-gray-100">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-24">
          <div className="bg-brand-bg rounded-[2rem] lg:rounded-[4rem] w-full min-h-[75vh] flex items-center px-8 py-16 lg:px-24 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full z-10 relative">
              
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white shadow-sm border border-gray-200 text-brand-dark font-semibold text-xs mb-8 uppercase tracking-wider">
                   PEI AGRI SRG01 Lombardia (2026-2028)
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-heading font-normal text-brand-text mb-6 leading-[1.1] tracking-tight">
                  <span className="block">Il Futuro Vola</span>
                  <span className="block italic text-brand-light/90">Sui Nostri Campi.</span>
                </h1>
                <p className="text-lg md:text-xl text-brand-text/80 font-light leading-relaxed mb-10 max-w-lg">
                  Scopri come l'uso dei droni multispettrali sta rivoluzionando l'agricoltura: meno chimica, più precisione, zero sprechi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#drone" className="inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-semibold rounded-full text-white bg-brand-accent hover:bg-brand-dark transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Scopri i Vantaggi
                    <ChevronRight className="ml-2 -mr-1 h-4 w-4" />
                  </a>
                </div>
              </motion.div>

              {/* Hero Images: satellite (scala macro) + drone (scala micro) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative h-[400px] lg:h-[550px] w-full mt-8 lg:mt-0 mb-10 lg:mb-0"
              >
                <div className="absolute inset-0 lg:left-12 rounded-3xl overflow-hidden shadow-xl">
                  <img src="/hero-satellite.jpg" alt="Immagine satellitare Sentinel-2 dei campi attorno al Po, presso Piacenza" className="w-full h-full object-cover" />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-dark text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">Satellite</span>
                </div>
                <p className="absolute top-full right-0 mt-2 w-[50%] lg:w-[62%] text-right text-[11px] leading-snug text-brand-text/60">
                  Contiene dati Copernicus Sentinel modificati (2022), elaborati da ESA
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -bottom-10 left-0 lg:-bottom-8 w-[45%] lg:w-[36%] aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-2xl"
                >
                  <img src="/hero-drone.jpg" alt="Drone multispettrale in volo sopra campi coltivati" className="w-full h-full object-cover scale-[2.6] origin-[50%_54%]" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-dark text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">Drone</span>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button (Bottom Right) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100/50 text-brand-light hover:scale-110 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-light/20">
          <Leaf className="h-6 w-6" />
        </button>
      </motion.div>

      {/* Perché il Drone? (Educational Section) */}
      <section id="drone" className="py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-brand-accent font-bold tracking-wider uppercase text-sm">Divulgazione</span>
              <h2 className="text-3xl md:text-5xl font-heading text-brand-dark mt-2">Perché usare il Drone?</h2>
              <div className="w-24 h-1 bg-brand-light mx-auto mt-6 rounded-full"></div>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                Il drone non è solo una telecamera volante. È uno strumento diagnostico e operativo che cambia radicalmente il modo in cui curiamo le colture.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Massima Precisione", desc: "Trattiamo solo le aree del campo che ne hanno realmente bisogno, pianta per pianta.", color: "bg-[#2B5219]/10", text: "text-[#2B5219]" },
              { icon: Sprout, title: "Zero Compattamento", desc: "A differenza dei trattori, il drone non schiaccia il suolo e non danneggia le colture in fase avanzata.", color: "bg-[#60795A]/10", text: "text-[#60795A]" },
              { icon: Zap, title: "Tempestività", desc: "Possiamo intervenire anche subito dopo forti piogge, quando i mezzi terrestri affonderebbero nel fango.", color: "bg-[#15240D]/10", text: "text-[#15240D]" },
              { icon: TrendingDown, title: "Meno Chimica", desc: "Sostituiamo i pesticidi con lanci mirati di insetti utili (lotta biologica) tramite speciali dispenser.", color: "bg-[#2B5219]/20", text: "text-[#2B5219]" }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="up" className="h-full">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-brand-light/30 transition-all duration-300 group h-full flex flex-col relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform`}></div>
                  <div className={`${feature.color} ${feature.text} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 flex-1">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Divulgazione e Risultati */}
      <section id="risultati" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading text-brand-dark">Materiale Divulgativo</h2>
              <div className="w-24 h-1 bg-brand-accent mx-auto mt-6 rounded-full"></div>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Condividiamo apertamente i risultati del progetto per favorire l'adozione di queste tecnologie da parte di agricoltori e consulenti.
              </p>
            </div>
          </FadeIn>

          {/* Mappe di esempio (dati sintetici, nessuna azienda reale) */}
          <FadeIn>
            <div className="mb-16">
              <h3 className="text-2xl md:text-3xl font-heading text-brand-dark mb-2">Dal Satellite al Drone, in 5 Passi</h3>
              <p className="text-gray-600 mb-8 max-w-3xl">
                Le immagini satellitari storiche e quelle della stagione in corso mostrano dove il campo varia: guidano i prelievi di suolo, poi il drone vola solo dove serve e guida una distribuzione di biostimolanti su misura. Esempio illustrativo su campi immaginari generati al computer: non riproduce dati di aziende reali.
              </p>
              <MapCarousel />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <FadeIn delay={0.1}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-gray-100 h-full flex flex-col group hover:bg-brand-dark hover:text-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <FileText className="h-10 w-10 text-brand-accent mb-6 group-hover:text-brand-light transition-colors" />
                <h3 className="text-xl mb-3">Linee Guida Pratiche</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 flex-1">
                  Manuale operativo per l'integrazione di dati satellitari e droni nella gestione del mais e del riso.
                </p>
                <span className="inline-flex items-center font-bold text-brand-dark group-hover:text-white">
                  Presto disponibile
                </span>
              </div>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={0.2}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-gray-100 h-full flex flex-col group hover:bg-brand-dark hover:text-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <Presentation className="h-10 w-10 text-brand-accent mb-6 group-hover:text-brand-light transition-colors" />
                <h3 className="text-xl mb-3">Eventi e Convegni</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 flex-1">
                  Partecipazione a fiere di settore (SIA) e incontri in campo con i Gruppi Operativi per mostrare il drone in azione.
                </p>
                <button onClick={() => setIsCalendarOpen(true)} className="inline-flex items-center font-bold text-brand-dark group-hover:text-white">
                  Calendario Eventi <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </FadeIn>

            {/* Card 3 */}
            <FadeIn delay={0.3}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-gray-100 h-full flex flex-col group hover:bg-brand-dark hover:text-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <BookOpen className="h-10 w-10 text-brand-accent mb-6 group-hover:text-brand-light transition-colors" />
                <h3 className="text-xl mb-3">Pubblicazioni Scientifiche</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 flex-1">
                  Articoli peer-reviewed sui risultati agronomici ed economici dell'uso dei biostimolanti a rateo variabile.
                </p>
                <a href="#" className="inline-flex items-center font-bold text-brand-dark group-hover:text-white">
                  Leggi gli Articoli <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Alert Box Divulgativo */}
          <FadeIn delay={0.4}>
            <div className="mt-12 bg-green-50 border-l-4 border-brand-accent p-6 rounded-r-xl flex items-start gap-4">
              <Info className="h-6 w-6 text-brand-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 text-lg">Lo sapevi che?</h4>
                <p className="text-gray-700 mt-1">
                  Un drone agricolo moderno può mappare fino a 50 ettari in un solo volo di 30 minuti, fornendo dati con una precisione di 2 cm/pixel, impossibili da ottenere con i soli satelliti.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Il Progetto (Context) */}
      <section id="progetto" className="py-24 bg-brand-bg relative overflow-hidden">
        {/* Decorative elements */}
        <Parallax speed={0.2} className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl"></Parallax>
        <Parallax speed={0.35} className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></Parallax>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <h2 className="text-3xl md:text-5xl font-heading text-brand-dark mb-6">Il Progetto BioDroneConsulting</h2>
              <p className="text-lg text-gray-700 mb-6">
                Finanziato da <strong>Regione Lombardia (PEI AGRI SRG01)</strong>, il progetto unisce ricerca scientifica e pratica agricola per dimostrare la fattibilità economica e ambientale delle nuove tecnologie.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-dark/10 p-3 rounded-lg text-brand-dark"><Users className="h-6 w-6" /></div>
                    <div>
                      <h4 className="text-gray-900">Partnership d'Eccellenza</h4>
                      <p className="text-sm text-gray-600 mt-1">Farm Consulting, UCSC DI.PRO.VE.S, CITIMAP e 6 aziende agricole lombarde.</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                      <img src="/logo-farmconsulting.svg" alt="Farm Consulting" className="h-9 max-w-full object-contain" />
                      <img src="/logo-unicatt.svg" alt="Università Cattolica del Sacro Cuore" className="h-16 object-contain" />
                    </div>
                    <img src="/logo-citimap.webp" alt="CITIMAP" className="h-16 object-contain brightness-0 opacity-80" />
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-brand-light/10 p-3 rounded-lg text-brand-light"><MapPin className="h-6 w-6" /></div>
                  <div>
                    <h4 className="text-gray-900"><CountUp to={50} /> Ettari di Sperimentazione</h4>
                    <p className="text-sm text-gray-600 mt-1">Campi pilota distribuiti tra Milano, Bergamo, Cremona e Mantova su Mais, Riso e Pomodoro.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative">
                <div className="absolute -top-6 -right-6 bg-brand-accent text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold shadow-lg transform rotate-12">
                  <span className="text-2xl"><CountUp to={30} /></span>
                  <span className="text-xs uppercase">Mesi</span>
                </div>
                <h3 className="text-2xl text-brand-dark mb-6 border-b pb-4">Output Attesi</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Mappe di Stabilità</strong>
                      <span className="text-gray-600 text-sm">6 mappe validate per le aziende partner.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Archivio Storico</strong>
                      <span className="text-gray-600 text-sm">Database Sentinel-2 strutturato e pronto all'uso.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Protocolli DSS</strong>
                      <span className="text-gray-600 text-sm">Regole validate per rateo variabile (drone+satellite).</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Baseline Scientifica</strong>
                      <span className="text-gray-600 text-sm">Linee guida per la consulenza agronomica regionale.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section id="contatti" className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 bg-brand-dark text-white flex flex-col justify-center relative overflow-hidden">
                <Parallax speed={0.25} className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></Parallax>
                
                <h2 className="text-3xl md:text-4xl font-heading mb-6 relative z-10">Resta Aggiornato</h2>
                <p className="text-gray-300 mb-10 text-lg relative z-10">
                  Sei un agricoltore o un consulente? Iscriviti per ricevere i materiali divulgativi e gli inviti alle prove in campo con i droni.
                </p>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Users className="h-6 w-6 text-brand-light" />
                    </div>
                    <div>
                      <h4 className="text-lg">Coordinamento</h4>
                      <p className="text-gray-400">Farm Consulting srl</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Mail className="h-6 w-6 text-brand-light" />
                    </div>
                    <div>
                      <h4 className="text-lg">Email Progetto</h4>
                      <a href="mailto:info@biodroneconsulting.it" className="text-gray-400 hover:text-white transition-colors">info@biodroneconsulting.it</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-10 lg:p-16">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Nome e Cognome</label>
                    <input type="text" id="name" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all" placeholder="Es. Mario Rossi" />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">Qualifica</label>
                    <select id="role" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all">
                      <option>Agricoltore</option>
                      <option>Consulente Agronomico</option>
                      <option>Ricercatore</option>
                      <option>Altro</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all" placeholder="mario@example.com" />
                  </div>
                  <button type="submit" className="w-full bg-brand-accent hover:bg-brand-dark text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                    Richiedi Informazioni
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-gray-400 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
                <img
                  src="/logo-biodrone-bianco.png"
                  alt="BioDroneConsulting"
                  className="h-14 w-auto transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-sm">Divulgazione e innovazione per l'agricoltura sostenibile in Lombardia tramite tecnologie UAV e satellitari.</p>
            </div>
            <div>
              <h4 className="text-white mb-4">Finanziamento</h4>
              <p className="text-sm">
                Progetto finanziato nell'ambito del PEI AGRI SRG01<br/>
                Regione Lombardia (2026-2028)
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Link Rapidi</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#drone" className="hover:text-white transition-colors">Perché il Drone</a></li>
                <li><a href="#risultati" className="hover:text-white transition-colors">Materiale Divulgativo</a></li>
                <li><button onClick={() => setIsCalendarOpen(true)} className="hover:text-white transition-colors">Calendario Eventi</button></li>
                <li><a href="#contatti" className="hover:text-white transition-colors">Contatti</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Partner di Progetto</h4>
              <div className="flex flex-col items-start gap-4 w-fit">
                <img src="/logo-farmconsulting.svg" alt="Farm Consulting" className="h-7 object-contain brightness-0 invert" />
                <img src="/logo-unicatt-bianco.png" alt="Università Cattolica del Sacro Cuore" className="h-14 object-contain" />
                <img src="/logo-citimap.webp" alt="CITIMAP" className="h-16 object-contain" />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} BioDroneConsulting. Tutti i diritti riservati.</p>
            <p className="text-xs">Disclaimer: Il contenuto di questo sito riflette solo l'opinione degli autori.</p>
          </div>
        </div>
      </footer>

      {/* Popup Calendario Eventi */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50"
            onClick={() => setIsCalendarOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8"
            >
              <button
                onClick={() => setIsCalendarOpen(false)}
                aria-label="Chiudi"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-heading text-brand-dark mb-2">Calendario Eventi</h3>
                <p className="text-gray-600">
                  Fiere di settore, incontri in campo e webinar dove poter vedere il drone in azione.
                </p>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center text-center gap-3 bg-brand-bg border border-gray-100 rounded-2xl py-12 px-6">
                  <Calendar className="h-10 w-10 text-brand-light" />
                  <p className="text-gray-700 max-w-md">
                    Nessun evento in programma al momento. Torna a trovarci presto: qui pubblicheremo fiere, incontri in campo e webinar del progetto.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.date);
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleDateString('it-IT', { month: 'short' }).replace('.', '').toUpperCase();
                    return (
                      <div key={`${event.title}-${event.date}`} className="flex items-start gap-5 bg-brand-bg border border-gray-100 rounded-2xl p-6">
                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-brand-dark text-white flex-shrink-0">
                          <span className="text-[11px] uppercase tracking-wide opacity-80">{month}</span>
                          <span className="text-2xl font-bold leading-none">{day}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg text-gray-900">{event.title}</h4>
                          {event.location && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="h-3.5 w-3.5" /> {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-gray-600 mt-2">{event.description}</p>
                          )}
                          {event.link && (
                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-brand-dark mt-3">
                              Maggiori informazioni <ChevronRight className="h-4 w-4 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-6 z-[100] max-w-sm bg-white p-6 rounded-3xl shadow-2xl border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="bg-brand-bg p-3 rounded-xl text-brand-dark">
                <Cookie className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Informativa sui Cookie</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Utilizziamo i cookie per offrirti la migliore esperienza sul nostro sito. Scopri di più nella nostra policy o scegli le tue preferenze.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCookieConsent(true)}
                    className="flex-1 bg-brand-accent hover:bg-brand-dark text-white text-[13px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                  >
                    Accetta
                  </button>
                  <button
                    onClick={() => handleCookieConsent(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold py-2.5 px-4 rounded-xl transition-colors"
                  >
                    Rifiuta
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
