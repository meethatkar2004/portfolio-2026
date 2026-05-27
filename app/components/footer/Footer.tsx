'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FooterLinkGroup from './FooterLinkGroup';
import Screensaver from './Screensaver';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ isLoading }: { isLoading: boolean }) {
  const footerRef = useRef<HTMLElement>(null);

  // useGSAP(() => {
  //   if (!footerRef.current || isLoading) return;

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: footerRef.current,
  //       start: 'top 60%',
  //       end: 'top 20%',
  //       scrub: true,
  //       markers: true,
  //     }
  //   });

  //   // Hardcoded hex colors from globals.css:
  //   // --background: #ffffeb;
  //   // --foreground: #2a1209;

  //   tl.to(footerRef.current, {
  //     backgroundColor: '#ffffeb',
  //     color: '#2a1209',
  //   }, 0);

  //   tl.to('.footer-title', {
  //     color: '#2a1209',
  //   }, 0);

  //   tl.to('.footer-link', {
  //     color: '#2a1209',
  //   }, 0);

  //   tl.to('.footer-big-text', {
  //     color: '#2a1209',
  //   }, 0);

  //   tl.to('.footer-small-text', {
  //     color: '#2a1209',
  //   }, 0);

  // }, { scope: footerRef, dependencies: [isLoading] });

  const connectLinks = [
    { label: 'Twitter', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
  ];

  const navigateLinks = [
    { label: 'Home', href: '#' },
    { label: 'Work', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer
      ref={footerRef}
      className="w-full pt-20 px-8 md:px-16 flex flex-col relative z-20 bg-background"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start w-full mx-auto z-10 max-w-[90rem]">
        <FooterLinkGroup title="CONNECT" links={connectLinks} />

        {/* Center screensaver element */}
        <Screensaver
          textArr={['INNOVATE', 'DESIGN', 'DEVELOP', 'CODE', 'ANIMATE', 'LAUNCH']}
          className="hidden md:flex w-[45vw] h-[45vh]"
        />

        <FooterLinkGroup title="NAVIGATE" links={navigateLinks} align="right" />
      </div>

      {/* Big text */}
      <div className="w-full flex justify-center mt-[3%] pt-[5%] z-10">
        <TextReveal
          text="MEET HATKAR"
          isLoading={isLoading}
          className="footer-big-text text-[14vw] md:text-[12.5vw] mx-auto whitespace-nowrap leading-none font-black font-heading tracking-tighter text-primary"
        />
      </div>

      {/* Bottom bar */}
      <div
        className="footer-small-text flex flex-col md:flex-row justify-between items-center w-full mx-auto text-[0.55rem] md:text-[0.65rem] font-mono tracking-widest uppercase z-10 max-w-360 text-foreground/40"
      >
        <p>© 2026 PORTFOLIO. ALL RIGHTS RESERVED. DESIGNED WITH PRECISION.</p>
        <p className="mt-4 md:mt-0 flex gap-4">
          <span>v1.0.1</span>
          <span>Built with Next.js & GSAP</span>
        </p>
      </div>
    </footer>
  );
}
