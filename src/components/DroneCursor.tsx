import React, { useEffect, useRef, useState } from 'react';

const PROP_CENTERS: [number, number][] = [
  [22, 22],
  [78, 22],
  [22, 78],
  [78, 78],
];

const DroneShape: React.FC<{ stroke: string; strokeWidth: number }> = ({ stroke, strokeWidth }) => (
  <g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {/* Body */}
    <rect x="38" y="32" width="24" height="36" rx="10" />
    {/* Arms */}
    <line x1="40" y1="36" x2="22" y2="22" />
    <line x1="60" y1="36" x2="78" y2="22" />
    <line x1="40" y1="64" x2="22" y2="78" />
    <line x1="60" y1="64" x2="78" y2="78" />
    {/* Propellers */}
    {PROP_CENTERS.map(([cx, cy], i) => (
      <g key={i} className="drone-cursor-prop" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <line x1={cx - 11} y1={cy} x2={cx + 11} y2={cy} />
        <line x1={cx} y1={cy - 11} x2={cx} y2={cy + 11} />
        <circle cx={cx} cy={cy} r="2.4" fill={stroke} stroke="none" />
      </g>
    ))}
  </g>
);

/**
 * Replaces the system mouse pointer with a hand-drawn drone whose
 * propellers spin, matching the site's line-art brand logo. Only
 * activates for fine-pointer (mouse) input so touch devices keep
 * their native tap behaviour untouched.
 */
const DroneCursor: React.FC = () => {
  const posRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('drone-cursor-active', enabled);
    return () => document.documentElement.classList.remove('drone-cursor-active');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const el = posRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      setVisible(true);
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={posRef} className={`drone-cursor ${visible ? 'drone-cursor-visible' : ''}`} aria-hidden="true">
      <svg width="46" height="46" viewBox="0 0 100 100">
        <DroneShape stroke="#FFFFFF" strokeWidth={7} />
        <DroneShape stroke="#15240D" strokeWidth={2.5} />
      </svg>
    </div>
  );
};

export default DroneCursor;
