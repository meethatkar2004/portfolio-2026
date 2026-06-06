"use client";

import React, { useEffect, useRef } from "react";

interface SkillItem {
  src: string;
  name: string;
  alt: string;
}

interface SkillsSpiralProps {
  skills: SkillItem[];
}

const ACTIVE_SLOTS = 8;
const SPEED = 0.05; // unit progress per second

const SkillsSpiral: React.FC<SkillsSpiralProps> = ({ skills }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const nameRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const containerWidthRef = useRef(360);
  const offsetRef = useRef(0);
  const nextSkillIndexRef = useRef(ACTIVE_SLOTS);
  const prevProgressRef = useRef<number[]>([0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]);

  // Generate Archimedean spiral path (viewBox 0 0 500 500)
  // Center is (250, 250), 3 turns, max radius is 220
  const generateSpiralD = () => {
    const cx = 250;
    const cy = 250;
    const turns = 3;
    const maxRadius = 210;
    const points = [];
    const totalTheta = turns * 2 * Math.PI;
    const steps = 240;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Normal Archimedean spiral
      const theta = t * totalTheta;
      const r = t * maxRadius;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return points.join(" ");
  };

  const spiralD = generateSpiralD();

  // ResizeObserver to track container width for pixel scaling
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidthRef.current = entry.contentRect.width;
      }
    });

    observer.observe(containerRef.current);

    // Set initial size
    containerWidthRef.current = containerRef.current.getBoundingClientRect().width;

    return () => observer.disconnect();
  }, []);

  // Animation Loop with Viewport Optimization
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let isVisible = false;

    const animate = (time: number) => {
      // 1. Instantly kill the loop if off-screen
      if (!isVisible) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const path = pathRef.current;
      const container = containerRef.current;

      if (path && container) {
        const pathLength = path.getTotalLength();
        const scaleFactor = containerWidthRef.current / 500;

        // Decrement offset to flow inwards (progress goes towards 0)
        offsetRef.current -= SPEED * delta;

        for (let i = 0; i < ACTIVE_SLOTS; i++) {
          const slot = slotRefs.current[i];
          const img = imgRefs.current[i];
          const nameEl = nameRefs.current[i];

          if (!slot || !img) continue;

          // Space the slots equally
          const baseP = i / ACTIVE_SLOTS;
          let p = (baseP + offsetRef.current) % 1.0;
          if (p < 0) p += 1.0;

          // Wrap-around detection: when progress rolls over from < 0.15 to > 0.85
          const prevP = prevProgressRef.current[i];
          if (prevP < 0.15 && p > 0.85) {
            const nextSkill = skills[nextSkillIndexRef.current];
            if (nextSkill) {
              img.src = nextSkill.src;
              img.alt = nextSkill.alt;
              if (nameEl) nameEl.textContent = nextSkill.name;

              // Increment index circular queue
              nextSkillIndexRef.current = (nextSkillIndexRef.current + 1) % skills.length;
            }
          }
          prevProgressRef.current[i] = p;

          // Get coordinates along spiral line
          const distance = p * pathLength;
          const point = path.getPointAtLength(distance);

          // Math calculations for Scale and Opacity
          // Near center (p -> 0) it scales down to 0.15. Near outer (p -> 1) it is 1.0.
          const scale = 0.15 + 0.85 * p;

          // Fade out near center (p < 0.15) and fade in at the outer edge (p > 0.85)
          let opacity = 1.0;
          if (p < 0.15) {
            opacity = p / 0.15;
          } else if (p > 0.85) {
            opacity = (1.0 - p) / 0.15;
          }

          // Apply high-performance translation and scaling
          const x = point.x * scaleFactor;
          const y = point.y * scaleFactor;

          slot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
          slot.style.opacity = `${opacity}`;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // 2. Setup the Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Spiral entered viewport: Reset time and start loop
            isVisible = true;
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
          } else {
            // Spiral left viewport: Stop loop
            isVisible = false;
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      // Trigger as soon as even 1 pixel is on/off screen
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [skills]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] px-4 py-8 bg-transparent select-none overflow-hidden relative">
      {/* Title block for SEO/Semantic HTML */}
      <div className="text-center mb-6 z-10">
        <h2 className="text-2xl font-bold tracking-wider text-white uppercase sm:text-3xl">
          Skills & Technologies
        </h2>
        {/* <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
          A continuous loop of my stack
        </p> */}
      </div>

      {/* Spiral Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] mx-auto overflow-hidden bg-transparent"
      >
        {/* SVG Spiral Path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 500 500"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="spiralLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.1} />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#0284c7" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d={spiralD}
            fill="none"
            stroke="url(#spiralLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* 8 Active Skill Slots */}
        {Array.from({ length: ACTIVE_SLOTS }).map((_, i) => {
          const initialSkill = skills[i % skills.length];
          return (
            <div
              key={i}
              ref={(node) => {
                slotRefs.current[i] = node;
              }}
              className="absolute left-0 top-0 w-[65px] h-[80px] xs:w-[75px] xs:h-[90px] bg-transparent flex flex-col items-center justify-center pointer-events-none select-none will-change-transform"
              style={{
                transform: "translate3d(250px, 250px, 0) translate(-50%, -50%) scale(0.15)",
                opacity: 0,
              }}
            >
              <img
                ref={(node) => {
                  imgRefs.current[i] = node;
                }}
                src={initialSkill.src}
                alt={initialSkill.alt}
                className="w-8 h-8 xs:w-10 xs:h-10 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                loading="eager"
              />
              <p
                ref={(node) => {
                  nameRefs.current[i] = node;
                }}
                className="text-[8px] xs:text-[9px] font-extrabold text-white/90 tracking-wider uppercase mt-1.5 text-center whitespace-nowrap bg-black/40 px-1.5 py-0.5 rounded-sm backdrop-blur-[2px] border border-white/5"
              >
                {initialSkill.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsSpiral;
