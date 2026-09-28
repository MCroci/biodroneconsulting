import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Satellite, TestTube, Activity, Navigation, Droplets } from 'lucide-react';

// Mappe di esempio generate da scripts/synthetic_maps.py (campi immaginari, nessun dato reale).
const STEPS = [
  {
    src: '/mappe/mappa-1-storico.webp',
    icon: Satellite,
    source: 'Satellite',
    short: 'Storico',
    title: 'Variabilità storica',
    desc: 'Più anni di immagini satellitari rivelano le zone dove la coltura cresce sempre bene, sempre meno, o cambia di anno in anno.',
  },
  {
    src: '/mappe/mappa-2-campionamento.webp',
    icon: TestTube,
    source: 'Suolo',
    short: 'Campionamento',
    title: 'Campionamento mirato del suolo',
    desc: 'Le zone guidano i prelievi: un campione nel punto più rappresentativo di ogni zona, invece di una griglia fitta. Meno analisi, informazioni più utili.',
  },
  {
    src: '/mappe/mappa-3-stagione.webp',
    icon: Activity,
    source: 'Satellite',
    short: 'Stagione',
    title: 'Monitoraggio in stagione',
    desc: 'Durante la stagione il satellite confronta il vigore attuale con lo storico e segnala le aree che si comportano in modo anomalo.',
  },
  {
    src: '/mappe/mappa-4-volo.webp',
    icon: Navigation,
    source: 'Drone',
    short: 'Volo',
    title: 'Volo mirato del drone',
    desc: 'Il drone sorvola solo le aree da verificare: meno tempo in campo e immagini dettagliate proprio dove servono.',
  },
  {
    src: '/mappe/mappa-5-biostimolanti.webp',
    icon: Droplets,
    source: 'Drone',
    short: 'Biostimolanti',
    title: 'Distribuzione di biostimolanti a rateo variabile',
    desc: 'Dai dati del drone nasce la mappa di distribuzione dei biostimolanti: più prodotto dove la coltura soffre, meno dove sta già bene.',
  },
];

export default function MapCarousel() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const step = STEPS[index];

  const goTo = (next: number) => {
    if (next < 0 || next >= STEPS.length || next === index) return;
    setState([next, next > index ? 1 : -1]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  };

  return (
    <div
      className="bg-brand-bg rounded-3xl border border-gray-100 p-4 sm:p-6 lg:p-8 outline-none focus-visible:ring-4 focus-visible:ring-brand-light/30"
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carosello"
      aria-label="Dal satellite al drone, in 5 passi"
    >
      {/* Passi */}
      <ol className="flex items-center gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <li key={s.src} className="flex items-center flex-1 min-w-0">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index ? 'step' : undefined}
              className={`flex items-center gap-2 w-full rounded-full px-2 sm:px-3 py-2 text-left transition-colors ${
                i === index ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-white'
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i === index ? 'bg-white text-brand-dark' : i < index ? 'bg-brand-light text-white' : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden md:block text-sm font-medium truncate">{s.short}</span>
            </button>
            {i < STEPS.length - 1 && <span className="hidden sm:block w-3 lg:w-6 h-px bg-gray-300 flex-shrink-0" />}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Mappa */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="aspect-[1200/1080]" />
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={step.src}
              src={step.src}
              alt={step.title}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d >= 0 ? '12%' : '-12%', opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d >= 0 ? '-12%' : '12%', opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) goTo(index + 1);
                else if (info.offset.x > 60) goTo(index - 1);
              }}
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
            />
          </AnimatePresence>
        </div>

        {/* Testo */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.src}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              aria-live="polite"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-dark/10 p-3 rounded-xl text-brand-dark">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                  Passo {index + 1} di {STEPS.length} · {step.source}
                </span>
              </div>
              <h4 className="text-2xl md:text-3xl font-heading text-brand-dark mb-3">{step.title}</h4>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Passo precedente"
              className="p-3 rounded-full border border-gray-300 text-brand-dark hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === STEPS.length - 1}
              aria-label="Passo successivo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-accent text-white font-semibold hover:bg-brand-dark disabled:opacity-30 disabled:hover:bg-brand-accent transition"
            >
              {index === STEPS.length - 1 ? 'Fine' : `Passo ${index + 2}`}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Precarica le altre mappe per un passaggio senza attese */}
      <div className="hidden" aria-hidden="true">
        {STEPS.map((s) => <img key={s.src} src={s.src} alt="" />)}
      </div>
    </div>
  );
}
