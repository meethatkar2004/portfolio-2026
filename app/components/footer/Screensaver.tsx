'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScreensaverProps {
  textArr?: string[];
  className?: string;
}

const DEFAULT_WORDS = ['DESIGN', 'DEVELOP', 'CODE', 'ANIMATE', 'LAUNCH'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

interface GlowWave {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export default function Screensaver({ textArr = DEFAULT_WORDS, className = '' }: ScreensaverProps) {
  const words = textArr.length > 0 ? textArr : DEFAULT_WORDS;

  const containerRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  const [cornerHits, setCornerHits] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 1.8, vy: 1.8 });
  const dimensionsRef = useRef({ cw: 0, ch: 0, ew: 0, eh: 0 });

  const particlesRef = useRef<Particle[]>([]);
  const glowsRef = useRef<GlowWave[]>([]);

  useEffect(() => {
    const speed = 1.8;
    velRef.current = {
      vx: Math.random() > 0.5 ? speed : -speed,
      vy: Math.random() > 0.5 ? speed : -speed,
    };

    const loadInitialHits = () => {
      const localVal = localStorage.getItem('corner_hits');
      if (localVal) {
        setCornerHits(parseInt(localVal, 10));
      }
    };

    loadInitialHits();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !elementRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const cw = containerRef.current?.clientWidth || 0;
      const ch = containerRef.current?.clientHeight || 0;
      const ew = elementRef.current?.offsetWidth || 0;
      const eh = elementRef.current?.offsetHeight || 0;

      const prevDimensions = dimensionsRef.current;
      dimensionsRef.current = { cw, ch, ew, eh };

      if (canvasRef.current) {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        canvasRef.current.width = cw * dpr;
        canvasRef.current.height = ch * dpr;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.resetTransform();
          ctx.scale(dpr, dpr);
        }
      }

      if (prevDimensions.cw === 0 && cw > 0) {
        posRef.current = { x: Math.max(0, (cw - ew) / 2), y: Math.max(0, (ch - eh) / 2) };
      } else {
        posRef.current.x = Math.min(posRef.current.x, Math.max(0, cw - ew));
        posRef.current.y = Math.min(posRef.current.y, Math.max(0, ch - eh));
      }
    });

    resizeObserver.observe(containerRef.current);
    resizeObserver.observe(elementRef.current);

    let animationFrameId: number;

    const spawnCornerBurst = (cx: number, cy: number, cornerType: string) => {
      glowsRef.current.push({ x: cx, y: cy, radius: 0, alpha: 1.0 });

      const count = 35;
      let baseAngle = 0;
      if (cornerType === 'tl') baseAngle = Math.PI / 4;
      if (cornerType === 'tr') baseAngle = 3 * Math.PI / 4;
      if (cornerType === 'bl') baseAngle = -Math.PI / 4;
      if (cornerType === 'br') baseAngle = -3 * Math.PI / 4;

      const colors = ['#ff007f', '#00f0ff', '#b000ff', '#ffb000'];

      for (let i = 0; i < count; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * (Math.PI / 3);
        const speed = 2 + Math.random() * 6;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 3 + Math.random() * 5,
          alpha: 1.0,
        });
      }
    };

    const updatePhysics = () => {
      if (bgOverlayRef.current) {
        bgOverlayRef.current.style.backgroundColor = document.body.style.backgroundColor || '#ffffeb';
      }

      const { cw, ch, ew, eh } = dimensionsRef.current;
      if (cw === 0 || ch === 0 || ew === 0 || eh === 0) {
        animationFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      const { x, y } = posRef.current;
      const { vx, vy } = velRef.current;

      let nextX = x + vx;
      let nextY = y + vy;

      const maxX = cw - ew;
      const maxY = ch - eh;

      const isNearLeft = nextX <= 8 && vx < 0;
      const isNearRight = nextX >= maxX - 8 && vx > 0;
      const isNearTop = nextY <= 8 && vy < 0;
      const isNearBottom = nextY >= maxY - 8 && vy > 0;

      if ((isNearLeft || isNearRight) && (isNearTop || isNearBottom)) {
        nextX = isNearLeft ? 0 : maxX;
        nextY = isNearTop ? 0 : maxY;
        velRef.current.vx = isNearLeft ? Math.abs(vx) : -Math.abs(vx);
        velRef.current.vy = isNearTop ? Math.abs(vy) : -Math.abs(vy);

        spawnCornerBurst(isNearLeft ? 0 : cw, isNearTop ? 0 : ch, (isNearTop ? 't' : 'b') + (isNearLeft ? 'l' : 'r'));

        if (hudRef.current) {
          hudRef.current.style.transform = 'scale(1.3)';
          setTimeout(() => {
            if (hudRef.current) hudRef.current.style.transform = 'scale(1)';
          }, 200);
        }

        setCornerHits((prev) => {
          const newVal = prev + 1;
          localStorage.setItem('corner_hits', String(newVal));
          return newVal;
        });
        setTextIndex((prev) => (prev + 1) % words.length);
      } else {
        if (nextX <= 0) {
          nextX = 0;
          velRef.current.vx = -vx;
        } else if (nextX >= maxX) {
          nextX = maxX;
          velRef.current.vx = -vx;
        }

        if (nextY <= 0) {
          nextY = 0;
          velRef.current.vy = -vy;
        } else if (nextY >= maxY) {
          nextY = maxY;
          velRef.current.vy = -vy;
        }
      }

      posRef.current = { x: nextX, y: nextY };

      if (elementRef.current) {
        elementRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, cw, ch);

          const glows = glowsRef.current;
          for (let i = glows.length - 1; i >= 0; i--) {
            const glow = glows[i];
            glow.radius += 8;
            glow.alpha -= 0.03;

            if (glow.alpha <= 0) {
              glows.splice(i, 1);
              continue;
            }

            ctx.beginPath();
            const grad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
            grad.addColorStop(0, `rgba(255, 0, 127, ${0.4 * glow.alpha})`);
            grad.addColorStop(0.5, `rgba(0, 240, 255, ${0.2 * glow.alpha})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
            ctx.fill();
          }

          const particles = particlesRef.current;
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.alpha -= 0.02;

            if (p.alpha <= 0) {
              particles.splice(i, 1);
              continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [words]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.7] flex select-none ${className}`}
    >
      <div
        ref={bgOverlayRef}
        className="absolute inset-0 bg-background opacity-90 pointer-events-none"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 12 }}
      />

      <div
        ref={hudRef}
        suppressHydrationWarning
        className="absolute top-4 left-4 z-20 font-mono text-[20px] tracking-widest text-foreground/50 select-none transition-transform duration-100 ease-out origin-left"
      >
        HITS: {String(cornerHits).padStart(2, '0')}
      </div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[clamp(12px,2vw,20px)] tracking-widest text-foreground/20 select-none uppercase font-black text-center whitespace-nowrap z-0'>
        Precision takes patience.
      </div>

      <div
        ref={elementRef}
        className="absolute top-0 left-0 font-heading font-black tracking-widest text-4xl uppercase select-none pointer-events-none will-change-transform whitespace-nowrap text-foreground/80 origin-center"
        style={{
          lineHeight: 'normal',
          padding: '6px 12px',
          zIndex: 13,
        }}
      >
        {words[textIndex]}
      </div>
    </div>
  );
}
