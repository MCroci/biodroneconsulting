import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, Map, Sprout, TestTube, TrendingDown, Users, BookOpen, 
  Newspaper, Mail, ChevronRight, MapPin, Calendar, FileText, ExternalLink, Menu, X,
  Target, BarChart3, Presentation, Navigation, Droplets, Zap, Camera, Cpu, Wifi, CheckCircle2,
  Info, AlertTriangle, Cookie
} from 'lucide-react';
import Hero3DBackground from './components/Hero3DBackground';

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

const DroneIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M14.12 14.12 17 17" />
    <path d="M9.88 14.12 7 17" />
    <path d="M14.12 9.88 17 7" />
    <path d="M9.88 9.88 7 7" />
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="7" r="2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isHoveringWorkflow, setIsHoveringWorkflow] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

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

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
    setShowCookieBanner(false);
  };

  // Auto-advance workflow steps for dynamism
  useEffect(() => {
    if (isHoveringWorkflow) return;
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHoveringWorkflow]);

  const navLinks = [
    { name: 'Il Drone', href: '#drone' },
    { name: 'Come Funziona', href: '#workflow' },
    { name: 'Il Progetto', href: '#progetto' },
    { name: 'Divulgazione', href: '#risultati' },
  ];

  const workflowSteps = [
    { title: "1. Mappatura Satellitare (WP2)", icon: Map, desc: "Acquisizione serie storiche Sentinel-2, calcolo indici (NDVI) e zonizzazione k-Means per le Management Zones.", color: "text-blue-500", bg: "bg-blue-500" },
    { title: "2. Volo Drone (Scala Micro)", icon: DroneIcon, desc: "Guidati dalle mappe satellitari, i droni (CITIMAP) acquisiscono immagini multispettrali ad altissima risoluzione per il calcolo indici sulle parcelle.", color: "text-brand-accent", bg: "bg-brand-accent" },
    { title: "3. Ground-Truthing Stratificato", icon: Target, desc: "Generazione coordinate per campionamenti mirati (UCSC) e validazione con Doppia Diagnostica vegetazione/suolo nudo.", color: "text-brand-dark", bg: "bg-brand-dark" },
    { title: "4. Protocolli DSS (WP5)", icon: Cpu, desc: "Validazione dei protocolli on-farm per la distribuzione a rateo variabile di biostimolanti, con analisi statistica su 2 stagioni.", color: "text-brand-light", bg: "bg-brand-light" }
  ];

  return (
    <div className="min-h-screen bg-brand-outer-bg text-brand-text font-body selection:bg-brand-light selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-4' : 'bg-white py-6'}`}>
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group text-brand-dark cursor-pointer">
              <div className="relative flex-shrink-0 z-10">
                <DroneIcon className="h-8 w-8 text-brand-light transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 ease-out" />
                <Wifi className="h-4 w-4 text-brand-accent absolute -top-1 -right-2 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
              </div>
              
              <div className="flex items-baseline font-heading tracking-tight text-brand-dark">
                <div className="flex">
                  <span className="font-bold text-2xl lg:text-3xl transition-colors duration-300">B</span>
                  <span className="text-xl lg:text-2xl transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap max-w-[50px] group-hover:max-w-0 group-hover:opacity-0 group-hover:-translate-x-4">io</span>
                </div>
                
                <div className="flex text-brand-light group-hover:text-brand-dark transition-colors duration-300">
                  <span className="font-bold text-2xl lg:text-3xl">D</span>
                  <span className="text-xl lg:text-2xl text-brand-dark transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap max-w-[80px] group-hover:max-w-0 group-hover:opacity-0 group-hover:-translate-x-4">rone</span>
                </div>
                
                <div className="flex items-baseline text-brand-accent group-hover:text-brand-dark transition-colors duration-300">
                  <span className="font-bold text-2xl lg:text-3xl">C</span>
                  <span className="font-sans font-bold text-[1.1rem] lg:text-[1.3rem] tracking-normal text-brand-text transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap max-w-[150px] group-hover:max-w-0 group-hover:opacity-0 group-hover:-translate-x-4">onsulting</span>
                </div>
              </div>
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
                  <a href="#drone" className="inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-semibold rounded-full text-white bg-brand-accent hover:bg-[#e0622a] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Scopri i Vantaggi
                    <ChevronRight className="ml-2 -mr-1 h-4 w-4" />
                  </a>
                  <a href="#workflow" className="inline-flex items-center justify-center px-8 py-3.5 border border-brand-text/20 text-[15px] font-semibold rounded-full text-brand-text hover:bg-brand-text/5 hover:text-brand-text transition-all">
                    Come Funziona
                    <DroneIcon className="ml-2 -mr-1 h-4 w-4" />
                  </a>
                </div>
              </motion.div>

              {/* 3D Drone Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative h-[400px] lg:h-[550px] w-full mt-8 lg:mt-0 flex items-center justify-center rounded-3xl overflow-hidden"
              >
                 <div className="absolute inset-0 bg-brand-light/5 rounded-full blur-3xl transform scale-150"></div>
                 <Hero3DBackground droneBodyColor="#1E352F" dronePropColor="#57A773" droneArmColor="#A0AEC0" />
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
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark mt-2">Perché usare il Drone?</h2>
              <div className="w-24 h-1 bg-brand-light mx-auto mt-6 rounded-full"></div>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                Il drone non è solo una telecamera volante. È uno strumento diagnostico e operativo che cambia radicalmente il modo in cui curiamo le colture.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Precisione Chirurgica", desc: "Trattiamo solo le aree del campo che ne hanno realmente bisogno, pianta per pianta.", color: "bg-blue-50", text: "text-blue-600" },
              { icon: Sprout, title: "Zero Compattamento", desc: "A differenza dei trattori, il drone non schiaccia il suolo e non danneggia le colture in fase avanzata.", color: "bg-green-50", text: "text-green-600" },
              { icon: Zap, title: "Tempestività", desc: "Possiamo intervenire anche subito dopo forti piogge, quando i mezzi terrestri affonderebbero nel fango.", color: "bg-orange-50", text: "text-orange-600" },
              { icon: TrendingDown, title: "Meno Chimica", desc: "Sostituiamo i pesticidi con lanci mirati di insetti utili (lotta biologica) tramite speciali dispenser.", color: "bg-purple-50", text: "text-purple-600" }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="up" className="h-full">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform`}></div>
                  <div className={`${feature.color} ${feature.text} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 flex-1">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Come Funziona (Interactive Workflow) */}
      <section id="workflow" className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Il Flusso Operativo</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Dallo spazio al singolo filo d'erba: ecco come i dati si trasformano in azione.
              </p>
            </div>
          </FadeIn>

          <div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            onMouseEnter={() => setIsHoveringWorkflow(true)}
            onMouseLeave={() => setIsHoveringWorkflow(false)}
          >
            {/* Steps Navigation */}
            <div className="lg:col-span-5 space-y-4">
              {workflowSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeWorkflowStep === idx 
                      ? 'bg-white/10 border-brand-light shadow-lg transform translate-x-2' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${activeWorkflowStep === idx ? step.bg + ' text-white' : 'bg-white/10 text-gray-400'}`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-xl ${activeWorkflowStep === idx ? 'text-white' : 'text-gray-400'}`}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeWorkflowStep === idx && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 text-gray-300 pl-16"
                      >
                        {step.desc}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Dynamic Visualizer */}
            <div className="lg:col-span-7 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorkflowStep}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gray-800"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Overlay UI based on step */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${workflowSteps[activeWorkflowStep].bg} animate-pulse`}></div>
                        <span className="font-mono text-sm text-brand-light tracking-wider uppercase">Fase Attiva</span>
                      </div>
                      <h4 className="text-2xl font-bold text-white">{workflowSteps[activeWorkflowStep].title}</h4>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Il Progetto (Context) */}
      <section id="progetto" className="py-24 bg-brand-bg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark mb-6">Il Progetto BioDroneConsulting</h2>
              <p className="text-lg text-gray-700 mb-6">
                Finanziato da <strong>Regione Lombardia (PEI AGRI SRG01)</strong>, il progetto unisce ricerca scientifica e pratica agricola per dimostrare la fattibilità economica e ambientale delle nuove tecnologie.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-dark/10 p-3 rounded-lg text-brand-dark"><Users className="h-6 w-6" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Partnership d'Eccellenza</h4>
                      <p className="text-sm text-gray-600 mt-1">Farm Consulting (Capofila), UCSC DI.PRO.VE.S (Ricerca), CITIMAP (Tecnologia) e 6 aziende agricole lombarde.</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex items-center gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/it/thumb/a/a2/Logo_della_Universit%C3%A0_Cattolica_del_Sacro_Cuore.svg/512px-Logo_della_Universit%C3%A0_Cattolica_del_Sacro_Cuore.svg.png" alt="Università Cattolica del Sacro Cuore" className="h-10 object-contain" />
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="bg-brand-light/10 p-3 rounded-lg text-brand-light"><MapPin className="h-6 w-6" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">50 Ettari di Sperimentazione</h4>
                    <p className="text-sm text-gray-600 mt-1">Campi pilota distribuiti tra Milano, Bergamo, Cremona e Mantova su Mais, Riso e Pomodoro.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative">
                <div className="absolute -top-6 -right-6 bg-brand-accent text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold shadow-lg transform rotate-12">
                  <span className="text-2xl">30</span>
                  <span className="text-xs uppercase">Mesi</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-6 border-b pb-4">Output Attesi</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Mappe di Stabilità (WP2)</strong>
                      <span className="text-gray-600 text-sm">6 mappe validate per le aziende partner.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Archivio Storico (WP2)</strong>
                      <span className="text-gray-600 text-sm">Database Sentinel-2 strutturato e pronto all'uso.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Protocolli DSS (WP5)</strong>
                      <span className="text-gray-600 text-sm">Regole validate per rateo variabile (drone+satellite).</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-light flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-sm">Baseline Scientifica (WP7)</strong>
                      <span className="text-gray-600 text-sm">Linee guida per la consulenza agronomica regionale.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Divulgazione e Risultati */}
      <section id="risultati" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark">Materiale Divulgativo</h2>
              <div className="w-24 h-1 bg-brand-accent mx-auto mt-6 rounded-full"></div>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Condividiamo apertamente i risultati del progetto per favorire l'adozione di queste tecnologie da parte di agricoltori e consulenti.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <FadeIn delay={0.1}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-gray-100 h-full flex flex-col group hover:bg-brand-dark hover:text-white transition-colors duration-300">
                <FileText className="h-10 w-10 text-brand-accent mb-6 group-hover:text-brand-light transition-colors" />
                <h3 className="text-xl font-bold mb-3">Linee Guida Pratiche</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 flex-1">
                  Manuale operativo per l'integrazione di dati satellitari e droni nella gestione del mais e del riso.
                </p>
                <a href="#" className="inline-flex items-center font-bold text-brand-dark group-hover:text-white">
                  Scarica PDF <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={0.2}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-gray-100 h-full flex flex-col group hover:bg-brand-dark hover:text-white transition-colors duration-300">
                <Presentation className="h-10 w-10 text-brand-accent mb-6 group-hover:text-brand-light transition-colors" />
                <h3 className="text-xl font-bold mb-3">Eventi e Convegni</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 flex-1">
                  Partecipazione a fiere di settore (SIA) e incontri in campo con i Gruppi Operativi per mostrare il drone in azione.
                </p>
                <a href="#" className="inline-flex items-center font-bold text-brand-dark group-hover:text-white">
                  Calendario Eventi <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </FadeIn>

            {/* Card 3 */}
            <FadeIn delay={0.3}>
              <div className="bg-brand-bg rounded-2xl p-8 border border-gray-100 h-full flex flex-col group hover:bg-brand-dark hover:text-white transition-colors duration-300">
                <BookOpen className="h-10 w-10 text-brand-accent mb-6 group-hover:text-brand-light transition-colors" />
                <h3 className="text-xl font-bold mb-3">Pubblicazioni Scientifiche</h3>
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
            <div className="mt-12 bg-orange-50 border-l-4 border-brand-accent p-6 rounded-r-xl flex items-start gap-4">
              <Info className="h-6 w-6 text-brand-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Lo sapevi che?</h4>
                <p className="text-gray-700 mt-1">
                  Un drone agricolo moderno può mappare fino a 50 ettari in un solo volo di 30 minuti, fornendo dati con una precisione di 2 cm/pixel, impossibili da ottenere con i soli satelliti.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contatti */}
      <section id="contatti" className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 bg-brand-dark text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 relative z-10">Resta Aggiornato</h2>
                <p className="text-gray-300 mb-10 text-lg relative z-10">
                  Sei un agricoltore o un consulente? Iscriviti per ricevere i materiali divulgativi e gli inviti alle prove in campo con i droni.
                </p>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Users className="h-6 w-6 text-brand-light" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Coordinamento</h4>
                      <p className="text-gray-400">Farm Consulting srl</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Mail className="h-6 w-6 text-brand-light" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email Progetto</h4>
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
                  <button type="submit" className="w-full bg-brand-accent hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                    Richiedi Informazioni
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
                <DroneIcon className="h-6 w-6 text-brand-light transform group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-500" />
                <div className="flex items-baseline font-heading tracking-tight text-white/90">
                  <div className="flex group-hover:text-white transition-colors duration-300">
                    <span className="font-bold text-xl">B</span>
                    <span className="text-lg transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap max-w-[50px] group-hover:max-w-0 group-hover:opacity-0 group-hover:-translate-x-2">io</span>
                  </div>
                  <div className="flex text-brand-light group-hover:text-white transition-colors duration-300">
                    <span className="font-bold text-xl">D</span>
                    <span className="text-lg text-white/90 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap max-w-[80px] group-hover:max-w-0 group-hover:opacity-0 group-hover:-translate-x-2">rone</span>
                  </div>
                  <div className="flex items-baseline text-brand-accent group-hover:text-white transition-colors duration-300">
                    <span className="font-bold text-xl">C</span>
                    <span className="font-sans font-bold text-sm tracking-normal text-white/70 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap max-w-[100px] group-hover:max-w-0 group-hover:opacity-0 group-hover:-translate-x-2">onsulting</span>
                  </div>
                </div>
              </div>
              <p className="text-sm">Divulgazione e innovazione per l'agricoltura sostenibile in Lombardia tramite tecnologie UAV e satellitari.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Finanziamento</h4>
              <p className="text-sm">
                Progetto finanziato nell'ambito del PEI AGRI SRG01<br/>
                Regione Lombardia (2026-2028)
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Link Rapidi</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#drone" className="hover:text-white transition-colors">Perché il Drone</a></li>
                <li><a href="#workflow" className="hover:text-white transition-colors">Come Funziona</a></li>
                <li><a href="#risultati" className="hover:text-white transition-colors">Materiale Divulgativo</a></li>
                <li><a href="#contatti" className="hover:text-white transition-colors">Contatti</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Partner Scientifico</h4>
              <div className="bg-white p-3 rounded-lg w-fit">
                <img src="https://upload.wikimedia.org/wikipedia/it/thumb/a/a2/Logo_della_Universit%C3%A0_Cattolica_del_Sacro_Cuore.svg/512px-Logo_della_Universit%C3%A0_Cattolica_del_Sacro_Cuore.svg.png" alt="Università Cattolica del Sacro Cuore" className="h-10 object-contain" />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} BioDroneConsulting. Tutti i diritti riservati.</p>
            <p className="text-xs">Disclaimer: Il contenuto di questo sito riflette solo l'opinione degli autori.</p>
          </div>
        </div>
      </footer>

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
                <h3 className="font-bold text-gray-900 mb-2">Informativa sui Cookie</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Utilizziamo i cookie per offrirti la migliore esperienza sul nostro sito. Scopri di più nella nostra policy o scegli le tue preferenze.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCookieConsent(true)}
                    className="flex-1 bg-brand-accent hover:bg-[#e0622a] text-white text-[13px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
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
