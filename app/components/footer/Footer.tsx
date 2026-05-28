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
      className="w-full pt-20 px-8 md:px-16 flex flex-col relative z-20 bg-transparent"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start w-full mx-auto z-10 max-w-360">
        <FooterLinkGroup title="CONNECT" links={connectLinks} />

        {/* Center screensaver element */}
        <Screensaver
          textArr={['DESIGN']}
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
        className="footer-small-text flex flex-col md:flex-row justify-between items-center w-full mx-auto text-[0.55rem] md:text-[0.65rem] font-mono tracking-widest uppercase z-10 max-w-360 text-foreground/40 pb-[2%]"
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
