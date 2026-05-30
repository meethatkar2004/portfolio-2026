// c:\Users\meeth\OneDrive\Desktop\portfolio_2026\app\components\certificateCard\CertificateCard.tsx
"use client";
import React from 'react'

import BorderGlow from '../../reactBitsComponents/borderGlow/BorderGlow'
import Image from 'next/image'
import Header from '../../commonComponents/Header/Header'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'


gsap.registerPlugin(ScrollTrigger);
import { useLoading } from '../../context/LoadingContext';

const CertificateCard = () => {
  const { isLoading } = useLoading();
  const certificateData = [
    {
      title: "SEO",
      description: "Optimized websites for higher rankings using advanced SEO, keyword strategy, and technical performance improvements.",
      image: "/certificates/seo-yellow.png",
      issueDate: "7-25",
      issueBy: "MOZ",
      link: "https://www.linkedin.com/learning/certificates/2583a0e52ca6a3a496403f5205b27a9ce4393258c5532a1589f09639773b8048/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3B6F1mzBjIR1muWDlrpc7YhA%3D%3D"
    },
    {
      title: "Three.js",
      description: "Built immersive 3D web experiences using Three.js, creating visually stunning, interactive websites.",
      image: "/certificates/ThreeJSBlur.png",
      issueDate: "04-26",
      issueBy: "Sheryains Coding School",
      link: "https://sheryians.com/certificate/2085873512282417"
    },
    {
      title: "Git & Github",
      description: "Streamlined development workflows with Git, GitHub, and automation tools for efficient project delivery.",
      image: "/certificates/github-yellow.png",
      issueDate: "6-25",
      issueBy: "Github",
      link: "https://www.linkedin.com/learning/certificates/baa0c2c86b9e8cd9de83186e6afeade4b9aee2b7836779aeef54ef6f6504e6a1/?trk=share_certificate&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3B6F1mzBjIR1muWDlrpc7YhA%3D%3D"
    }
  ]

  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLoading || !containerRef.current) return;

    gsap.to(document.body, {
      backgroundColor: "#343434", // Deep black background for certificates section
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%", // starts when the top of the certificates section enters the screen from the bottom
        end: "top 30%",   // completes when the section reaches the upper-middle part of the viewport
        toggleActions: "play reverse play reverse",
        scrub: true,
        // markers: true,
      },
    });
  }, { dependencies: [isLoading], scope: containerRef });

  return (
    <Header
      title="Proof of Skill, Built for Results"
      description="Industry-recognized certifications in SEO, Three.js, and GitHub that sharpen my ability to build high-performing, visually engaging, and professionally managed digital experiences."
      className='w-full'
      titleClass='text-white!'
      descClass='text-gray-100!'
    >
      <div ref={containerRef} className='w-full flex flex-wrap items-stretch gap-8 justify-center mt-10 pb-16'>
        {certificateData.map((certificate, index) => (
          <div
            key={index}
            data-cursor="view"
            onClick={() => window.open(certificate.link, "_blank")}
            className='mx-[1.5%] relative group cursor-pointer transition-all duration-500 ease-out origin-bottom transform-3d hover:transform-[perspective(1000px)_translateZ(-40px)_rotateX(-15deg)] hover:scale-y-90 rounded-[32px]'
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="255 255 105"
              backgroundColor="#FFFFFF"
              borderRadius={32}
              glowRadius={60}
              glowIntensity={5}
              coneSpread={25}
              animated={false}
              colors={['#476afd', '#011257', '#a0b3ff']}
            >

              <div
                className='w-[370px] h-[560px] flex flex-col bg-background rounded-[32px] overflow-hidden'
              >
                {/* Card Content Wrapper */}
                <div className="relative z-10 h-full w-full p-5 flex flex-col justify-between text-left">
                  {/* 1. Image Area (Aspect Square with black bg) */}
                  <div className="w-full aspect-square bg-[#0c0f16] rounded-[24px] overflow-hidden mb-5 relative flex items-center justify-center">
                    <Image
                      src={certificate.image}
                      alt={certificate.title}
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                    />
                  </div>

                  {/* 2. Text Content */}
                  <div className='flex flex-col flex-grow justify-between text-left'>
                    <div>
                      {/* Title & Date Row */}
                      <div className="flex justify-between items-baseline mb-2">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-heading">{certificate.title}</h2>
                        <span className="text-sm font-mono text-gray-600 font-bold">{certificate.issueDate}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4 font-sans font-medium">
                        {certificate.description}
                      </p>
                    </div>

                    {/* 3. Issued By (Pushed to bottom) */}
                    <div className="border-t pt-3 border-gray-300/60 mt-auto">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1">Issued By</p>
                      <p className="text-base font-bold text-[#d97706] font-heading">{certificate.issueBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>
        ))}
      </div>
    </Header>
  )
}

export default CertificateCard;
