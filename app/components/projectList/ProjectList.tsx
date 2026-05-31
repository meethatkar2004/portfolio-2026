import React from 'react';
import ProjectListClient from './ProjectListClient';

interface Project {
  name: string;
  roles: string;
  image: string;
  link: string;
}

const projects: Project[] = [
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
  return (
    <ProjectListClient projects={projects} />
  );
};

export default ProjectList;