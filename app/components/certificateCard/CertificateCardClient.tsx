'use client';

import React from 'react';
import BorderGlow from '../../reactBitsComponents/borderGlow/BorderGlow';
import Image from 'next/image';
import Header from '../../commonComponents/Header/Header';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmGrain from '../../commonComponents/FilmGrain/FilmGrain';

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  title: string;
  description: string;
  image: string;
  issueDate: string;
  issueBy: string;
  link: string;
}

interface CertificateCardClientProps {
  certificateData: Certificate[];
}

export default function CertificateCardClient({ certificateData }: CertificateCardClientProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 2xl:px-24 4k:px-32">
      <FilmGrain zIndex={5} />
      <Header
        title="Proof of Skill, Built for Results"
        description="Industry-recognized certifications in SEO, Three.js, and GitHub that sharpen my ability to build high-performing, visually engaging, and professionally managed digital experiences."
        className='w-full relative z-5'
        titleClass='text-white!'
        descClass='text-gray-100!'
      >
        {/* FIXED: Changed from 'grid' to 'flex flex-wrap justify-center' so items perfectly align centrally on wide screens */}
        <div
          ref={containerRef}
          className='w-full flex flex-wrap justify-center gap-6 xl:gap-8 mt-10 pb-16 relative overflow-visible mx-auto'
        >
          {certificateData.map((certificate, index) => (
            <div
              key={index}
              data-cursor="view"
              onClick={() => window.open(certificate.link, "_blank")}
              // {/* FIXED: Replaced w-full with a clean base width basis so flex elements scale uniformly */}
              className='w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] xl:w-[380px] 4k:w-[480px] max-w-[550px] relative group cursor-pointer transition-all duration-500 ease-out origin-bottom transform-3d hover:transform-[perspective(1000px)_translateZ(-40px)_rotateX(-15deg)] hover:scale-y-90 rounded-[32px] z-10'
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="255 255 105"
                borderRadius={32}
                glowRadius={60}
                glowIntensity={5}
                coneSpread={25}
                animated={false}
                colors={['#476afd', '#011257', '#a0b3ff']}
              >
                <div
                  className='w-full min-h-[520px] md:min-h-[560px] 4k:min-h-[700px] flex flex-col bg-background/25 rounded-[32px] overflow-hidden'
                >
                  <div className="relative z-10 h-full w-full p-5 lg:p-6 4k:p-8 flex flex-col justify-between text-left flex-grow">

                    <div className="w-full aspect-square bg-transparent rounded-[24px] overflow-hidden mb-5 relative flex items-center justify-center">
                      <Image
                        src={certificate.image}
                        alt={`${certificate.title} certificate issued by ${certificate.issueBy}`}
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                      />
                    </div>

                    <div className='flex flex-col flex-grow justify-between text-left'>
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-2 mb-2">
                          <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] 4k:text-[clamp(1.75rem,2.5vw,2.5rem)] font-bold tracking-tight text-gray-100 font-heading">{certificate.title}</h2>
                          <span className="text-[clamp(0.75rem,1.2vw,0.875rem)] 4k:text-xl font-mono text-gray-300 font-bold shrink-0">{certificate.issueDate}</span>
                        </div>

                        <p className="text-[clamp(0.85rem,1.2vw,0.95rem)] 4k:text-lg text-gray-300 leading-relaxed line-clamp-3 mb-4 font-sans font-medium">
                          {certificate.description}
                        </p>
                      </div>

                      <div className="border-t pt-3 border-gray-300/60 mt-auto">
                        <p className="text-[clamp(10px,1vw,12px)] 4k:text-sm uppercase tracking-[0.2em] text-gray-300 font-semibold mb-1">Issued By</p>
                        <p className="text-[clamp(0.9rem,1.4vw,1.1rem)] 4k:text-2xl font-bold text-[#E0D09B] font-heading">{certificate.issueBy}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </BorderGlow>
            </div>
          ))}
        </div>
      </Header>
    </div>
  );
}