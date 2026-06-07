'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import FooterLinkGroup from './FooterLinkGroup';
import Screensaver from './Screensaver';
import TextReveal from './TextReveal';
import { useLoading } from '../../context/LoadingContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LinkItem {
  label: string;
  href: string;
}

interface FooterClientProps {
  connectLinks: LinkItem[];
  navigateLinks: LinkItem[];
}

export default function FooterClient({ connectLinks, navigateLinks }: FooterClientProps) {
  const { isLoading } = useLoading();
  const footerRef = useRef<HTMLElement>(null);

  const handleScroll = (label: string) => {
    const link = navigateLinks.find((l) => l.label === label);
    if (link) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: link.href, autoKill: true },
        ease: 'power3.inOut'
      });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="w-full pt-16 md:pt-24 flex flex-col relative z-20 bg-transparent px-4 sm:px-8 lg:px-16 2xl:px-24 4k:px-36 overflow-hidden"
    >
      {/* Top Layout Section */}
      <div className="w-full mx-auto z-10 max-w-7xl 2xl:max-w-[100rem] 4k:max-w-[150rem] flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-4">

        {/* Links Wrapper for Mobile Layout (Side-by-Side setup) */}
        <div className="w-full flex justify-between items-start md:flex-1 md:justify-start">
          <FooterLinkGroup title="CONNECT" links={connectLinks} />

          {/* Kept visible ONLY on mobile/tablet screen viewports */}
          <div className="block md:hidden text-right">
            <FooterLinkGroup
              title="NAVIGATE"
              links={navigateLinks}
              align="right"
              onClickItem={handleScroll}
            />
          </div>
        </div>

        {/* --- MOBILE SCREENSAVER LAYOUT --- */}
        {/* Displays gracefully between the links and the giant text on mobile devices */}
        <Screensaver
          textArr={['DESIGN']}
          className="flex md:hidden w-full h-[20vh] min-h-[120px] max-h-[180px] rounded-xl overflow-hidden opacity-80"
        />

        {/* --- DESKTOP SCREENSAVER LAYOUT --- */}
        <Screensaver
          textArr={['DESIGN']}
          className="hidden md:flex w-[35vw] h-[25vh] lg:h-[35vh] max-w-[500px] max-h-[350px] 4k:max-w-[900px] 4k:max-h-[550px]"
        />

        {/* Standard Desktop Navigation layout positioning */}
        <div className="hidden md:flex flex-1 justify-end text-right">
          <FooterLinkGroup
            title="NAVIGATE"
            links={navigateLinks}
            align="right"
            onClickItem={handleScroll}
          />
        </div>
      </div>

      {/* Big text Section */}
      <div className="w-full flex justify-center pt-10 md:pt-[5%] z-10 overflow-hidden select-none pointer-events-none">
        <TextReveal
          text="MEET HATKAR"
          isLoading={isLoading}
          className="footer-big-text text-[clamp(2.3rem,11.5vw,13rem)] 2xl:text-[14rem] 4k:text-[22rem] mx-auto whitespace-nowrap leading-none font-black font-heading tracking-tighter text-primary text-center"
        />
      </div>

      {/* Bottom bar */}
      <div
        className="footer-small-text border-t border-foreground/10 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center w-full mx-auto text-[clamp(0.65rem,0.6rem+0.15vw,0.75rem)] 4k:text-xl font-mono tracking-widest uppercase z-10 max-w-7xl 2xl:max-w-[100rem] 4k:max-w-[150rem] text-foreground/40 gap-4 pb-8 md:pb-[2%] text-center sm:text-left"
      >
        <p className="max-w-xs sm:max-w-none leading-relaxed">
          © 2026 PORTFOLIO. ALL RIGHTS RESERVED. DESIGNED WITH PRECISION.
        </p>
        <p className="flex gap-4 sm:gap-6 shrink-0">
          <span>v1.0.1</span>
          <span>Built with Next.js &amp; GSAP</span>
        </p>
      </div>
    </footer>
  );
}