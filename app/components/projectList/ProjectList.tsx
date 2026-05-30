'use client';

import React, { useState } from 'react';
import FloatingImage from '../../commonComponents/floatingImage/FloatingImage';
import Header from '../../commonComponents/Header/Header';


interface Project {
  name: string;
  roles: string;
  image: string;
  link: string;
}

const projects = [
  { name: "Cosmic Orbit", roles: "Three.js, WebGL, 3D Experience", image: "/projects/SolarSystem.webp", link: "https://the-solar-system-phi.vercel.app/" },
  { name: "Nova Labs", roles: "Experiments, WebGL, Creative Dev", image: "/projects/ThreeJS.webp", link: "https://three-js-challenge-list.vercel.app/" },
  { name: "Vision Pro", roles: "Product Landing, Premium UI, Animation", image: "/projects/AppleWebsite.webp", link: "https://vision-pro-landing-page.netlify.app/" },
  { name: "MagmaFlow", roles: "Motion Design, GSAP, Landing Page", image: "/projects/Magma.webp", link: "https://magma-landing-page.netlify.app/" },
  { name: "Product Designer Portfolio", roles: "Portfolio, Minimal UI, Smooth Motion", image: "/projects/CynthiaPortfolio.webp", link: "https://cynthia-ugwu-portfolio-clone.netlify.app/" },
  { name: "UrbanWood Furnitures", roles: "E-Commerce, Furniture, UI Design", image: "/projects/KosiFurniture.webp", link: "https://urbanwood-rosy.vercel.app/" },
  { name: "StoryVerse", roles: "Branding, UI/UX, Interactive, Motion", image: "/projects/StoryStitchers.webp", link: "https://story-stitchers.netlify.app/" },
  { name: "Duo Studio", roles: "Creative Agency, Branding, Motion", image: "/projects/DuoStudio.webp", link: "https://duo-studio-landing-page.netlify.app/" },
  { name: "Sidcup Family Golf", roles: "Sports Brand, Scroll Effects, UI/UX", image: "/projects/GolfSite.webp", link: "https://sidecup-family-golf-landing-page.netlify.app/" },
];
const ProjectList = () => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);


  return (
    <Header
      className="w-full p-[2%] px-[3%]"
      title="Work That Speaks in Pixels"
      description="A curated collection of modern websites and interactive experiences crafted to blend creativity, performance, and conversion-focused design."
    >
      <div
        className='w-full relative'
        onMouseLeave={() => {
          setHoveredProject(null);
        }}
      >
        <FloatingImage project={hoveredProject} />

        <div className="border-t border-black/30 flex flex-col">
          {projects.map((project, index) => (
            <div
              key={index}
              data-index={index}
              data-cursor="project"
              className="project-item group flex flex-col sm:flex-row sm:items-center justify-between py-6 sm:py-8 border-b border-b-gray-400 cursor-pointer relative hover:py-[2.5%] transition-[padding] ease-linear"
              onMouseEnter={() => {
                setHoveredProject(project);
              }}
              onClick={() => window.open(project.link, "_blank")}
            >
              <h3 className={`font-semibold tracking-tight transition-all duration-500 origin-left ${
                hoveredProject && hoveredProject.name === project.name 
                  ? 'text-2xl sm:text-5xl text-heading' 
                  : hoveredProject 
                    ? 'text-lg sm:text-xl text-heading/50' 
                    : 'text-lg sm:text-xl text-heading/30'
              }`}>
                {project.name}
              </h3>
              <p className={`text-sm sm:text-base font-medium transition-all duration-500 ${
                hoveredProject && hoveredProject.name === project.name 
                  ? 'text-heading opacity-100' 
                  : hoveredProject 
                    ? 'text-heading/50' 
                    : 'text-heading/50'
              }`}>
                {project.roles}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Header>
  );
};

export default ProjectList;