"use client";
import React from 'react';
import { useRef, useCallback, useState, useEffect, useSyncExternalStore, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false], [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false], [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(', ');
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

interface AnimateOpts {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (t: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [sweepActive, setSweepActive] = useState(false);

  // Only enable glow on devices with a fine pointer (mouse/trackpad).
  // Touch-only devices (phones, tablets) skip the effect entirely.
  // useSyncExternalStore avoids cascading-render warnings from setState-in-useEffect.
  const hasMousePointer = useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia('(pointer: fine)');
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(pointer: fine)').matches,
    () => false
  );

  const lastProximity = useRef(0);
  const lastAngle = useRef(45);

  const updateDOM = useCallback((proximity: number, angle: number, visible: boolean) => {
    if (!cardRef.current) return;

    const colorSensitivity = edgeSensitivity + 20;
    const borderOp = visible
      ? Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity))
      : 0;
    const glowOp = visible
      ? Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
      : 0;

    // Batch DOM writes into rAF to prevent layout thrashing (Read/Write cycles)
    requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
      cardRef.current.style.setProperty('--border-opacity', borderOp.toString());
      cardRef.current.style.setProperty('--glow-opacity', glowOp.toString());
    });
  }, [edgeSensitivity]);

  const getEdgeProximity = useCallback((width: number, height: number, x: number, y: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, []);

  const getCursorAngle = useCallback((width: number, height: number, x: number, y: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasMousePointer) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect(); // READ PHASE
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastProximity.current = getEdgeProximity(rect.width, rect.height, x, y);
    lastAngle.current = getCursorAngle(rect.width, rect.height, x, y);

    // WRITE PHASE is batched inside updateDOM's requestAnimationFrame
    updateDOM(lastProximity.current, lastAngle.current, true);
  }, [hasMousePointer, getEdgeProximity, getCursorAngle, updateDOM]);

  useEffect(() => {
    updateDOM(lastProximity.current, lastAngle.current, isHovered || sweepActive);
  }, [isHovered, sweepActive, updateDOM]);

  useEffect(() => {
    if (!animated || !hasMousePointer) return;
    const angleStart = 110;
    const angleEnd = 465;

    requestAnimationFrame(() => {
      setSweepActive(true);
      lastAngle.current = angleStart;
      updateDOM(lastProximity.current, lastAngle.current, true);
    });

    animateValue({
      duration: 500, onUpdate: v => {
        lastProximity.current = v / 100;
        updateDOM(lastProximity.current, lastAngle.current, true);
      }
    });
    animateValue({
      ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
        lastAngle.current = (angleEnd - angleStart) * (v / 100) + angleStart;
        updateDOM(lastProximity.current, lastAngle.current, true);
      }
    });
    animateValue({
      ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
        lastAngle.current = (angleEnd - angleStart) * (v / 100) + angleStart;
        updateDOM(lastProximity.current, lastAngle.current, true);
      }
    });
    animateValue({
      ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => {
        lastProximity.current = v / 100;
        updateDOM(lastProximity.current, lastAngle.current, true);
      },
      onEnd: () => setSweepActive(false),
    });
  }, [animated, hasMousePointer, updateDOM]);

  const isVisible = hasMousePointer && (isHovered || sweepActive);

  // Memoize heavy string calculations
  const { borderBg, fillBg } = React.useMemo(() => {
    const meshGradients = buildMeshGradients(colors);
    return {
      borderBg: meshGradients.map(g => `${g} border-box`),
      fillBg: meshGradients.map(g => `${g} padding-box`)
    };
  }, [colors]);

  return (
    <div
      ref={cardRef}
      onPointerMove={hasMousePointer ? handlePointerMove : undefined}
      onPointerEnter={hasMousePointer ? () => setIsHovered(true) : undefined}
      onPointerLeave={hasMousePointer ? () => setIsHovered(false) : undefined}
      className={`relative grid isolate border border-white/15 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
      }}
    >
      {/* mesh gradient border */}
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: 'var(--border-opacity)',
          maskImage: `conic-gradient(from var(--cursor-angle) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from var(--cursor-angle) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        }}
      />

      {/* mesh gradient fill near edges */}
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: fillBg.join(', '),
          maskImage: [
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          WebkitMaskImage: [
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          maskComposite: 'subtract, add, add, add, add, add',
          WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over, source-over',
          opacity: `calc(var(--border-opacity) * ${fillOpacity})`,
          mixBlendMode: 'soft-light',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        } as React.CSSProperties}
      />

      {/* outer glow */}
      <span
        className="absolute pointer-events-none z-[1] rounded-[inherit]"
        style={{
          inset: `${-glowRadius}px`,
          maskImage: `conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage: `conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity: 'var(--glow-opacity)',
          mixBlendMode: 'plus-lighter',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        } as React.CSSProperties}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="flex flex-col h-full relative overflow-auto z-[1]">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
