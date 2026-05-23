import React, { forwardRef } from 'react';

const HeroText = forwardRef<
  HTMLDivElement,
  { sectionRef: React.RefObject<HTMLDivElement | null> }
>(({ sectionRef }, ref) => {
  const textArr = ["FORGET NORMAL. CREATE IMPACT", "TURN CLICKS INTO OBSESSION", "BREAK THE ORDINARY. BUILD THE UNFORGETTABLE."];

  return (
    <div ref={ref} className="relative w-full py-[5%] overflow-hidden bg-background z-10 flex items-center">
      <div
        ref={sectionRef}
        className="flex items-center w-max px-[5vw] whitespace-nowrap"
      >
        <h1 className="text-[13vmax] font-heading font-black leading-none tracking-tighter text-heading select-none">
          {text}
        </h1>
      </div>
    </div>
  );
});

HeroText.displayName = 'HeroText';

export default HeroText;