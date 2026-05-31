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
const ProjectItemsList = React.memo(({
  projects,
  onHover
}: {
  projects: Project[];
  onHover: (project: Project | null) => void;
}) => {
  return (
    <div className="border-t border-black/30 flex flex-col project-list-container">
      {projects.map((project, index) => (
        <div
          key={index}
          data-index={index}
          data-cursor="project"
          className="project-item group flex flex-col sm:flex-row sm:items-center justify-between py-6 sm:py-8 border-b border-b-gray-400 cursor-pointer relative ease-out duration-300"
          onMouseEnter={() => {
            onHover(project);
          }}
          onClick={() => window.open(project.link, "_blank")}
        >
          <h3 className="project-title font-semibold tracking-tight transition-all duration-500 origin-left">
            {project.name}
          </h3>
          <p className="project-roles text-sm sm:text-base font-medium transition-all duration-500">
            {project.roles}
          </p>
        </div>
      ))}
    </div>
  );
});

ProjectItemsList.displayName = 'ProjectItemsList';

const ProjectList = () => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const handleHover = React.useCallback((project: Project | null) => {
    setHoveredProject(project);
  }, []);

  return (
    <Header
      className="w-full p-[2%] px-[3%]"
      title="Work That Speaks in Pixels"
      description="A curated collection of modern websites and interactive experiences crafted to blend creativity, performance, and conversion-focused design."
    >
      <div
        className="w-full relative"
        onMouseLeave={() => {
          setHoveredProject(null);
        }}
      >
        <FloatingImage projects={projects} hoveredProjectName={hoveredProject?.name || null} />

        <ProjectItemsList projects={projects} onHover={handleHover} />
      </div>
    </Header>
  );
};

export default ProjectList;