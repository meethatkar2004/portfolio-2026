'use client';

import React from 'react';
import Link from 'next/link';

interface AnimatedLinkProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  'data-cursor'?: string;
}

export default function AnimatedLink({ href, onClick, className = '', children, target, rel, ...props }: AnimatedLinkProps) {
  // Wrapper contains group/link class to trigger hover state
  const innerContent = (
    <span className="relative inline-flex flex-col group/link">
      <span className="relative z-10">{children}</span>
      
      {/* Underline container with overflow hidden to clip the sliding lines */}
      <span className="absolute bottom-0 left-0 w-full h-[1.4px] overflow-hidden pointer-events-none">
        {/* Initial line that slides out to the right */}
        <span 
          className="absolute inset-0 w-full h-full bg-primary transform-gpu translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-[150%]" 
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} 
        />
        
        {/* New line that slides in from the left */}
        <span 
          className="absolute inset-0 w-full h-full bg-primary transform-gpu -translate-x-[150%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-0" 
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} 
        />
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className} target={target} rel={rel} {...props}>
        {innerContent}
      </Link>
    );
  }

  return (
    <span onClick={onClick} className={`cursor-pointer ${className}`} {...props}>
      {innerContent}
    </span>
  );
}
