import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Satellite, TestTube, Activity, Navigation, Droplets } from 'lucide-react';

// Colori delle 4 classi di variabilità storica, condivisi da più mappe/legende
// (stessi valori usati in scripts/synthetic_maps.py, variabile stab_cols).
const STABILITY_SWATCHES = [
  { color: '#3F6B2E', label: 'Sempre alto' },
  { color: '#E6D9A8', label: 'Nella media' },
  { color: '#C9793F', label: 'Sempre basso' },
  { color: '#B7AFCF', label: 'Variabile' },
];

// Mappe di esempio generate da scripts/synthetic_maps.py (campi immaginari, nessun dato reale).
// Le immagini contengono solo la mappa (colori, contorni, badge, scala, freccia nord): la legenda,
// che prima era testo disegnato dentro l'immagine, ora vive qui come dati e viene renderizzata
// come HTML interattivo (vedi componente Legend più sotto).
const STEPS = [
  {
    src: '/mappe/mappa-1-storico.webp',
    icon: Satellite,
    source: 'Satellite',
    short: 'Storico',
    title: 'Variabilità storica',
    desc: 'Più anni di immagini satellitari rivelano le zone dove la coltura cresce sempre bene, sempre meno, o cambia di anno in anno.',
    legend: { kind: 'swatches' as const, items: STABILITY_SWATCHES },
  },
  {
    src: '/mappe/mappa-2-campionamento.webp',
    icon: TestTube,
    source: 'Suolo',
    short: 'Campionamento',
    title: 'Campionamento mirato del suolo',
    desc: 'Le zone guidano i prelievi: un campione nel punto più rappresentativo di ogni zona, invece di una griglia fitta. Meno analisi, informazioni più utili.',
    legend: {
      kind: 'sampling' as const,
      caption: '14 prelievi mirati invece di 34 a griglia',
      markers: [
        { style: 'ring-thick' as const, color: '#B23A2B', label: 'Prelievo mirato' },
        { style: 'ring-thin' as const, color: '#7A7A70', label: 'Griglia tradizionale (1/ha)' },
      ],
      swatches: STABILITY_SWATCHES,
    },
  },
  {
    src: '/mappe/mappa-3-stagione.webp',
    icon: Activity,
    source: 'Satellite',
    short: 'Stagione',
    title: 'Monitoraggio in stagione',
    desc: 'Durante la stagione il satellite confronta il vigore attuale con lo storico e segnala le aree che si comportano in modo anomalo.',
    legend: {
      kind: 'scale' as const,
      title: 'Vigore attuale (NDVI) e aree anomale',
      stops: ['#B98E5A', '#E6D39A', '#A9C77E', '#4E8A3E', '#15401F'],
      low: 'Basso',
      high: 'Alto',
      ticks: ['0.65', '0.70', '0.75', '0.80'],
      extra: [{ style: 'dashed-line' as const, color: '#B23A2B', label: 'Area da verificare' }],
      // Varianti della mappa (stesso dato NDVI, stessa mappa) con le zone sotto ogni soglia
      // evidenziate in rosso: generate da scripts/synthetic_maps.py (stagione_map(soglia=...)).
      thresholdVariants: {
        '0.65': '/mappe/mappa-3-stagione-soglia-65.webp',
        '0.70': '/mappe/mappa-3-stagione-soglia-70.webp',
        '0.75': '/mappe/mappa-3-stagione-soglia-75.webp',
        '0.80': '/mappe/mappa-3-stagione-soglia-80.webp',
      } as Record<string, string>,
    },
  },
  {
    src: '/mappe/mappa-4-volo.webp',
    icon: Navigation,
    source: 'Drone',
    short: 'Volo',
    title: 'Volo mirato del drone',
    desc: 'Il drone sorvola solo le aree da verificare: meno tempo in campo e immagini dettagliate proprio dove servono.',
    legend: {
      kind: 'mixed' as const,
      items: [
        { style: 'patch' as const, color: '#B23A2B', fill: '#E7B7AE', label: 'Area da sorvolare' },
        { style: 'line' as const, color: '#15240D', label: 'Passate di rilievo' },
        { style: 'dashed-line' as const, color: '#15240D', label: 'Trasferimento' },
        { style: 'marker-square' as const, color: '#15240D', label: 'Decollo' },
      ],
    },
  },
  {
    src: '/mappe/mappa-5-biostimolanti.webp',
    icon: Droplets,
    source: 'Drone',
    short: 'Biostimolanti',
    title: 'Distribuzione di biostimolanti a rateo variabile',
    desc: 'Dai dati del drone nasce la mappa di distribuzione dei biostimolanti: più prodotto dove la coltura soffre, meno dove sta già bene.',
    legend: {
      kind: 'swatches' as const,
      items: [
        { color: '#9DBB86', label: 'Dose −25%' },
        { color: '#EFE3BF', label: 'Dose standard' },
        { color: '#DE9A4C', label: 'Dose +25%' },
        { color: '#A33A1F', label: 'Dose +50%' },
      ],
    },
  },
];

/** Chip di legenda con un piccolo campione visivo (colore, linea, marker...) + etichetta. */
const LegendChip: React.FC<{ swatch: React.ReactNode; label: string }> = ({ swatch, label }) => (
  <motion.span
    whileHover={{ scale: 1.06, y: -1 }}
    whileTap={{ scale: 0.97 }}
    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm cursor-default"
  >
    {swatch}
    {label}
  </motion.span>
);

const ColorSwatch: React.FC<{ color: string }> = ({ color }) => (
  <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: color }} />
);

const RingMarker: React.FC<{ color: string; thick?: boolean }> = ({ color, thick }) => (
  <span
    className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-white"
    style={{ border: `${thick ? 2 : 1.5}px solid ${color}` }}
  />
);

const LineSwatch: React.FC<{ color: string; dashed?: boolean }> = ({ color, dashed }) =>
  dashed ? (
    <span className="w-4 flex-shrink-0 border-t-2 border-dashed" style={{ borderColor: color }} />
  ) : (
    <span className="h-0.5 w-4 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
  );

const PatchSwatch: React.FC<{ color: string; fill: string }> = ({ color, fill }) => (
  <span className="h-2.5 w-3.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: fill, border: `1.5px solid ${color}` }} />
);

const SquareMarker: React.FC<{ color: string }> = ({ color }) => (
  <span className="h-2.5 w-2.5 flex-shrink-0 rounded-[2px] ring-1 ring-gray-300" style={{ backgroundColor: color, border: '1.5px solid white' }} />
);

type StepLegend = (typeof STEPS)[number]['legend'];

function Legend({
  legend,
  activeTick,
  pinnedTick,
  onHoverTick,
  onPinTick,
}: {
  legend: StepLegend;
  activeTick?: string | null;
  pinnedTick?: string | null;
  onHoverTick?: (t: string | null) => void;
  onPinTick?: (t: string | null) => void;
}) {
  if (legend.kind === 'swatches') {
    return (
      <div className="flex flex-wrap gap-2">
        {legend.items.map((item) => (
          <LegendChip key={item.label} swatch={<ColorSwatch color={item.color} />} label={item.label} />
        ))}
      </div>
    );
  }

  if (legend.kind === 'sampling') {
    return (
      <div>
        <p className="text-sm font-semibold text-brand-dark mb-2">{legend.caption}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {legend.markers.map((m) => (
            <LegendChip key={m.label} swatch={<RingMarker color={m.color} thick={m.style === 'ring-thick'} />} label={m.label} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {legend.swatches.map((item) => (
            <LegendChip key={item.label} swatch={<ColorSwatch color={item.color} />} label={item.label} />
          ))}
        </div>
      </div>
    );
  }

  if (legend.kind === 'scale') {
    const ticks = legend.ticks;
    const pickTick = (clientX: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const frac = Math.min(0.999, Math.max(0, (clientX - rect.left) / rect.width));
      return ticks[Math.min(ticks.length - 1, Math.floor(frac * ticks.length))];
    };
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{legend.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{legend.low}</span>
          <div
            className="relative h-4 flex-1 flex items-center cursor-pointer"
            onMouseMove={(e) => onHoverTick?.(pickTick(e.clientX, e.currentTarget))}
            onMouseLeave={() => onHoverTick?.(null)}
            onClick={(e) => {
              const t = pickTick(e.clientX, e.currentTarget);
              onPinTick?.(pinnedTick === t ? null : t);
            }}
          >
            <div
              className="h-2.5 w-full rounded-full"
              style={{ background: `linear-gradient(to right, ${legend.stops.join(', ')})` }}
            />
            {activeTick && (
              <motion.div
                layout
                transition={{ duration: 0.15 }}
                className="absolute top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-white shadow ring-2 ring-brand-dark pointer-events-none"
                style={{ left: `${((ticks.indexOf(activeTick) + 0.5) / ticks.length) * 100}%` }}
              />
            )}
          </div>
          <span className="text-xs text-gray-500">{legend.high}</span>
        </div>
        <div className="flex justify-between mt-1 px-6">
          {ticks.map((t) => (
            <button
              key={t}
              type="button"
              onMouseEnter={() => onHoverTick?.(t)}
              onMouseLeave={() => onHoverTick?.(null)}
              onClick={() => onPinTick?.(pinnedTick === t ? null : t)}
              className={`text-[11px] rounded px-1 transition-colors ${
                activeTick === t ? 'text-white bg-brand-dark' : 'text-gray-400 hover:text-brand-dark'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {legend.extra.map((item) => (
            <LegendChip key={item.label} swatch={<LineSwatch color={item.color} dashed />} label={item.label} />
          ))}
        </div>
        <p className="text-xs text-brand-accent mt-2 min-h-[1em]">
          {activeTick
            ? `In rosso: aree con NDVI attuale sotto ${activeTick}${pinnedTick === activeTick ? ' · soglia fissata, clicca per sbloccare' : ' (clicca per fissare)'}`
            : 'Passa il cursore sulla scala per vedere le aree sotto una soglia di NDVI'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {legend.items.map((item) => (
        <LegendChip
          key={item.label}
          swatch={
            item.style === 'patch' ? <PatchSwatch color={item.color} fill={item.fill!} />
            : item.style === 'dashed-line' ? <LineSwatch color={item.color} dashed />
            : item.style === 'marker-square' ? <SquareMarker color={item.color} />
            : <LineSwatch color={item.color} />
          }
          label={item.label}
        />
      ))}
    </div>
  );
}

export default function MapCarousel() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [hoverTick, setHoverTick] = useState<string | null>(null);
  const [pinTick, setPinTick] = useState<string | null>(null);
  const step = STEPS[index];
  const activeTick = pinTick ?? hoverTick;
  const thresholdSrc =
    activeTick && step.legend.kind === 'scale' ? step.legend.thresholdVariants?.[activeTick] : undefined;

  useEffect(() => {
    setHoverTick(null);
    setPinTick(null);
  }, [index]);

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
          <div className="aspect-[1200/896]" />
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
          <AnimatePresence>
            {thresholdSrc && (
              <motion.img
                key={thresholdSrc}
                src={thresholdSrc}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              />
            )}
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
              <p className="text-gray-600 leading-relaxed mb-4">{step.desc}</p>
              <Legend
                legend={step.legend}
                activeTick={activeTick}
                pinnedTick={pinTick}
                onHoverTick={setHoverTick}
                onPinTick={setPinTick}
              />
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

      {/* Precarica le altre mappe (e le varianti della soglia NDVI) per un passaggio senza attese */}
      <div className="hidden" aria-hidden="true">
        {STEPS.map((s) => <img key={s.src} src={s.src} alt="" />)}
        {STEPS.flatMap((s) => (s.legend.kind === 'scale' ? Object.values(s.legend.thresholdVariants ?? {}) : [])).map(
          (src) => <img key={src} src={src} alt="" />
        )}
      </div>
    </div>
  );
}
