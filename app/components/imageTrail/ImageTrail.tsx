'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const skillImages = [
  { src: '/skills/tailwind_css.webp', alt: 'Tailwind CSS', name: 'TAILWIND CSS' },
  { src: '/skills/grafana.webp', alt: 'Grafana', name: 'GRAFANA' },
  { src: '/skills/github.webp', alt: 'GitHub', name: 'GITHUB' },
  { src: '/skills/redux.webp', alt: 'Redux', name: 'REDUX' },
  { src: '/skills/typescript.webp', alt: 'TypeScript', name: 'TYPESCRIPT' },
  { src: '/skills/docker.webp', alt: 'Docker', name: 'DOCKER' },
  { src: '/skills/python.webp', alt: 'Python', name: 'PYTHON' },
  { src: '/skills/next_js.webp', alt: 'Next.js', name: 'NEXT.JS' },
  { src: '/skills/three_js.webp', alt: 'Three.js', name: 'THREE.JS' },
];

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
const distance = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);

type ImageTrailProps = {
  enabled?: boolean;
  threshold?: number;
};

export default function ImageTrail({ enabled = true, threshold = 100 }: ImageTrailProps) {
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const rafRef = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cacheMousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const zIndex = useRef(1);

  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!enabled || !supportsHover || prefersReducedMotion) return;

    let isMounted = true;
    const trailImages = imageRefs.current;
    const parent = containerRef.current?.parentElement;

    if (!parent) return;

    const preloadImages = skillImages.map(({ src }) => {
      const img = new window.Image();
      img.src = src;
      return img.decode?.().catch(() => undefined);
    });

    const showNextImage = () => {
      const image = imageRefs.current[imageIndex.current];
      if (!image) return;

      const rect = image.getBoundingClientRect();

      gsap.killTweensOf(image);
      gsap.timeline()
        .set(image, {
          opacity: 1,
          scale: 1,
          zIndex: zIndex.current,
          x: cacheMousePos.current.x - rect.width / 2,
          y: cacheMousePos.current.y - rect.height / 2,
        })
        .to(image, {
          duration: 0.9,
          ease: 'expo.out',
          x: mousePos.current.x - rect.width / 2,
          y: mousePos.current.y - rect.height / 2,
        }, 0)
        .to(image, {
          duration: 1,
          ease: 'power1.out',
          opacity: 0,
        }, 0.4)
        .to(image, {
          duration: 1,
          ease: 'quint.out',
          scale: 0.2,
        }, 0.4);
    };

    const render = () => {
      if (!isMounted || !isHovering.current) return;

      const moved = distance(
        mousePos.current.x,
        mousePos.current.y,
        lastMousePos.current.x,
        lastMousePos.current.y
      );

      cacheMousePos.current.x = lerp(cacheMousePos.current.x || mousePos.current.x, mousePos.current.x, 0.1);
      cacheMousePos.current.y = lerp(cacheMousePos.current.y || mousePos.current.y, mousePos.current.y, 0.1);

      if (moved > threshold) {
        showNextImage();
        zIndex.current += 1;
        imageIndex.current = imageIndex.current < skillImages.length - 1 ? imageIndex.current + 1 : 0;
        lastMousePos.current = mousePos.current;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    const handlePointerEnter = (e: PointerEvent) => {
      isHovering.current = true;
      const rect = parent.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      
      mousePos.current = { x: localX, y: localY };
      cacheMousePos.current = { x: localX, y: localY };
      lastMousePos.current = { x: localX, y: localY };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerLeave = () => {
      isHovering.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    Promise.all(preloadImages).finally(() => {
      if (!isMounted) return;
      parent.addEventListener('pointerenter', handlePointerEnter as EventListener);
      parent.addEventListener('pointermove', handlePointerMove as EventListener);
      parent.addEventListener('pointerleave', handlePointerLeave as EventListener);
    });

    return () => {
      isMounted = false;
      parent.removeEventListener('pointerenter', handlePointerEnter as EventListener);
      parent.removeEventListener('pointermove', handlePointerMove as EventListener);
      parent.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      trailImages.forEach((image) => image && gsap.killTweensOf(image));
    };
  }, [enabled, threshold]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden="true">
      {skillImages.map((image, index) => (
        <div
          key={image.src}
          ref={(node) => {
            imageRefs.current[index] = node;
          }}
          className="absolute left-0 top-0 h-[clamp(3.5rem,7vw,7.5rem)] w-[clamp(3.5rem,7vw,7.5rem)] opacity-0 will-change-transform"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={360}
            height={360}
            className="h-full w-full scale-150 object-contain drop-shadow-[0_18px_28px_rgba(42,18,9,0.22)]"
            priority={index < 3}
          />
          <p className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 text-xs md:text-sm font-bold tracking-widest text-background drop-shadow-md whitespace-nowrap uppercase">
            {image.name}
          </p>
        </div>
      ))}
    </div>
  );
}
