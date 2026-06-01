"use client";
import React, { useEffect, useRef, useState } from 'react'

interface EyeProps {
  key_val: number;
}

const Eye = ({ key_val }: EyeProps) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState(0);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!eyeRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    });
    observer.observe(eyeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return; // Optimization: only run calculations when eye is in viewport

    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      // Calculate angle for the rotating line (which hosts the pupil)
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotate(angle - 180);

      // Shift the black inner circle slightly following the mouse relative to its own size
      const pctX = deltaX / (window.innerWidth / 2);
      const pctY = deltaY / (window.innerHeight / 2);

      // Clamp values between -1 and 1 to prevent excessive shifts
      const clampedPctX = Math.max(-1, Math.min(1, pctX));
      const clampedPctY = Math.max(-1, Math.min(1, pctY));

      setEyeOffset({
        x: clampedPctX * 0.6,
        y: clampedPctY * 0.6
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInView]);

  return (
    <div
      ref={eyeRef}
      id={`eyes-wrapper-1-${key_val}`}
      className='w-[13vmax] h-[13vmax] rounded-full bg-white flex items-center justify-center'
    >
      <div
        id="eyes-wrapper-2"
        className='w-2/3 h-2/3 bg-black rounded-full relative'
        style={{ transform: `translate(${eyeOffset.x}vmax, ${eyeOffset.y}vmax)` }}
      >
        <div className="line h-9 w-full absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}>
          <div id="pupil" className='w-9 h-9 bg-white rounded-full'>
          </div>
        </div>
        <p className="play absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-gray-400 text-[clamp(8px,0.6vmax,12px)] text-center tracking-widest">HOVER TO REVEAL SKILLS</p>
      </div>
    </div>
  )
}

export default Eye


