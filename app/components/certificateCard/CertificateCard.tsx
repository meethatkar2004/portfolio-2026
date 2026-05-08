// c:\Users\meeth\OneDrive\Desktop\portfolio_2026\app\components\certificateCard\CertificateCard.tsx
"use client";
import React from 'react'
import PixelCard from '../../reactBitsComponents/pixelCard/PixelCard'
import BorderGlow from '../../reactBitsComponents/borderGlow/BorderGlow'
import Image from 'next/image'
import Header from '../../commonComponents/Header/Header'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

const CertificateCard = () => {
  const certificateData = [
    {
      title: "SEO",
      description: "Optimized websites for higher rankings using advanced SEO, keyword strategy, and technical performance improvements.",
      image: "/certificates/SEO.jpg",
      issueDate: "7-25",
      issueBy: "MOZ"
    },
    {
      title: "Three.js",
      description: "Built immersive 3D web experiences using Three.js, creating visually stunning, interactive websites.",
      image: "/certificates/ThreeJS.jpg",
      issueDate: "04-26",
      issueBy: "Sheryains Coding School"
    },
    {
      title: "Git & Github",
      description: "Streamlined development workflows with Git, GitHub, and automation tools for efficient project delivery.",
      image: "/certificates/Github.png",
      issueDate: "6-25",
      issueBy: "Github"
    }
  ]

  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.to("body", {
      backgroundColor: "#000000", // Deep dark navy instead of just black for better look
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom 40%",
        toggleActions: "play reverse play reverse",
        scrub: true,
        // markers: true,
      },
    });
  });

  return (
    <Header
      title="Proof of Skill, Built for Results"
      description="Industry-recognized certifications in SEO, Three.js, and GitHub that sharpen my ability to build high-performing, visually engaging, and professionally managed digital experiences."
      className='w-full'
      titleClass='text-white!'
      descClass='text-gray-100!'
    >
      <div ref={containerRef} className='w-full h-[450px] flex flex-wrap items-stretch gap-8 justify-center'>
        {certificateData.map((certificate, index) => (
          <BorderGlow
            edgeSensitivity={30}
            glowColor="228 97 64"
            backgroundColor="#FFFFFF"
            borderRadius={28}
            glowRadius={60}
            glowIntensity={5}
            coneSpread={25}
            animated={false}
            colors={['#476afd', '#011257', '#a0b3ff']}
            key={index}
            className='h-full hover:cursor-pointer'
          >
            <PixelCard
              variant={"blue"}
              className='w-[320px] h-full flex flex-col bg-[#dae9fd]' // Adjusted size for better layout
            >
              <div className="relative z-10 h-full w-full p-4 pb-none flex flex-col justify-between">

                {/* 1. Image Area */}
                <div className="w-full aspect-4/3 bg-gray-100 rounded-2xl border-3 border-gray-400 flex items-center justify-center mb-6 overflow-hidden backdrop-blur-sm">
                  <Image src={certificate.image} alt={certificate.title} className="h-full w-full object-cover"
                    width={200}
                    height={200}
                  ></Image>
                  {/* When you have real images, use: <img src={certificate.image} className="w-full h-full object-cover" /> */}
                </div>

                <div className='mt-auto'>
                  {/* 2. Title & Date Row */}
                  <div className="flex justify-between items-baseline mb-3">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">{certificate.title}</h2>
                    <span className="text-xs font-mono text-gray-600">{certificate.issueDate}</span>
                  </div>

                  {/* 3. Description */}
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
                    {certificate.description}
                  </p>

                  {/* 4. Issued By (Pushed to bottom) */}
                  <div className="mt-auto border-t pt-1 border-gray-200">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1">Issued By</p>
                    <p className="text-sm font-medium text-blue-600">{certificate.issueBy}</p>
                  </div>
                </div>

              </div>
            </PixelCard>
          </BorderGlow>
        ))}
      </div>
    </Header>
  )
}

export default CertificateCard
