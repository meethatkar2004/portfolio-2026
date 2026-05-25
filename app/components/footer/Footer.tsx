import FooterLinkGroup from './FooterLinkGroup';

export default function Footer() {
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
    <footer className="w-full bg-[#343434] text-[#e0e0e0] pt-20 pb-8 px-8 md:px-16 flex flex-col relative z-20">
      {/* Top Section */}
      <div className="flex justify-between items-start w-full mx-auto z-10 max-w-[90rem]">
        <FooterLinkGroup title="CONNECT" links={connectLinks} />
        
        {/* Center decorative element */}
        <div className="hidden md:flex w-[45vw] h-[30vh] rounded-xl relative overflow-hidden items-center justify-center shadow-2xl bg-[#2a2a2a]">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-[#343434] to-yellow-600/20 opacity-80 mix-blend-overlay"></div>
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
          
          <div className="w-12 h-12 border border-white/5 rounded-xl flex items-center justify-center bg-white/5 backdrop-blur-md relative z-10 shadow-lg cursor-pointer hover:bg-white/10 transition-colors duration-300">
            <div className="w-3 h-3 bg-white/40 rounded-sm blur-[1px]"></div>
          </div>
        </div>

        <FooterLinkGroup title="NAVIGATE" links={navigateLinks} align="right" />
      </div>

      {/* Big text */}
      <div className="w-full flex justify-center mt-24 md:mt-32 mb-8 z-10">
        <h1 className="text-[14vw] md:text-[12vw] leading-none font-bold text-[#e5e5d8] font-heading tracking-tight select-none opacity-90">
          PORTFOLIO
        </h1>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full mx-auto pt-6 text-[0.55rem] md:text-[0.65rem] text-[#6c6c6c] font-mono tracking-widest uppercase z-10 max-w-[90rem]">
        <p>© 2026 PORTFOLIO. ALL RIGHTS RESERVED. DESIGNED WITH PRECISION.</p>
        <p className="mt-4 md:mt-0 flex gap-4">
          <span>v2.0.4</span>
          <span>Built with Next.js & GSAP</span>
        </p>
      </div>
    </footer>
  );
}
