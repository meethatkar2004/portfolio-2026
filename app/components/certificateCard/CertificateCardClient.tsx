'use client';

import React from 'react';
import BorderGlow from '../../reactBitsComponents/borderGlow/BorderGlow';
import Image from 'next/image';
import Header from '../../commonComponents/Header/Header';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../../context/LoadingContext';
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
  const { isLoading } = useLoading();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLoading || !containerRef.current) return;

    gsap.to([document.body, document.documentElement], {
      backgroundColor: "#343434",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play reverse play reverse",
        scrub: true,
      },
    });
  }, { dependencies: [isLoading], scope: containerRef });

  return (
    <div>
      <FilmGrain zIndex={5} />
      <Header
        title="Proof of Skill, Built for Results"
        description="Industry-recognized certifications in SEO, Three.js, and GitHub that sharpen my ability to build high-performing, visually engaging, and professionally managed digital experiences."
        className='w-full'
        titleClass='text-white!'
        descClass='text-gray-100!'
      >
        <div ref={containerRef} className='w-full flex flex-wrap items-stretch gap-8 justify-center mt-10 pb-16 relative overflow-hidden'>
          {certificateData.map((certificate, index) => (
            <div
              key={index}
              data-cursor="view"
              onClick={() => window.open(certificate.link, "_blank")}
              className='mx-[1.5%] relative group cursor-pointer transition-all duration-500 ease-out origin-bottom transform-3d hover:transform-[perspective(1000px)_translateZ(-40px)_rotateX(-15deg)] hover:scale-y-90 rounded-[32px] z-10'
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
                  className='w-[370px] h-[560px] flex flex-col bg-background/25 rounded-[32px] overflow-hidden'
                >
                  <div className="relative z-10 h-full w-full p-5 flex flex-col justify-between text-left">
                    <div className="w-full aspect-square bg-transparent rounded-[24px] overflow-hidden mb-5 relative flex items-center justify-center">
                      <Image
                        src={certificate.image}
                        alt={certificate.title}
                        className="w-full h-full object-cover"
                        width={300}
                        height={300}
                      />
                    </div>

                    <div className='flex flex-col flex-grow justify-between text-left'>
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <h2 className="text-[clamp(1.25rem,1.5vw,1.5rem)] font-bold tracking-tight text-gray-100 font-heading">{certificate.title}</h2>
                          <span className="text-[clamp(0.75rem,1vw,0.875rem)] font-mono text-gray-300 font-bold">{certificate.issueDate}</span>
                        </div>

                        <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-gray-300 leading-relaxed line-clamp-3 mb-4 font-sans font-medium">
                          {certificate.description}
                        </p>
                      </div>

                      <div className="border-t pt-3 border-gray-300/60 mt-auto">
                        <p className="text-[clamp(9px,0.8vw,11px)] uppercase tracking-[0.2em] text-gray-300 font-semibold mb-1">Issued By</p>
                        <p className="text-[clamp(0.875rem,1.2vw,1rem)] font-bold text-[#E0D09B] font-heading">{certificate.issueBy}</p>
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
