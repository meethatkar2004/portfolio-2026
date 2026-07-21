import React from 'react';
import ProjectListClient from './ProjectListClient';

interface Project {
  name: string;
  roles: string;
  image: string;
  link: string;
}

const projects: Project[] = [
  { name: "Scale2World", roles: "SaaS Platform, CPaaS, Multi-Tenant, Next.js", image: "/projects/scale2world.webp", link: "https://scale2world.com/" },
  { name: "MagmaFlow", roles: "Motion Design, GSAP, Landing Page", image: "/projects/Magma.webp", link: "https://magma-landing-page.netlify.app/" },
  { name: "UrbanWood Furnitures", roles: "E-Commerce, Furniture, UI Design", image: "/projects/KosiFurniture.webp", link: "https://urbanwood-rosy.vercel.app/" },
  // { name: "Duo Studio", roles: "Creative Agency, Branding, Motion", image: "/projects/DuoStudio.webp", link: "https://duo-studio-landing-page.netlify.app/" },
  { name: "Story-Stitchers", roles: "Interactive Storytelling, E-Commerce, Motion", image: "/projects/storyStitchers.webp", link: "https://story-stitchers.netlify.app/" },
  { name: "Product Designer Portfolio", roles: "Portfolio, Minimal UI, Smooth Motion", image: "/projects/CynthiaPortfolio.webp", link: "https://cynthia-ugwu-portfolio-clone.netlify.app/" },
  // { name: "Sidcup Family Golf", roles: "Sports Brand, Scroll Effects, UI/UX", image: "/projects/GolfSite.webp", link: "https://sidecup-family-golf-landing-page.netlify.app/" },
  { name: "Ferrari 360", roles: "Automotive Brand, 3D Experience, Premium UI", image: "/projects/ferrari-inspired-ferrari360.webp", link: "https://ferrari-360.vercel.app/" },
  { name: "Vision Pro", roles: "Product Landing, Premium UI, Animation", image: "/projects/AppleWebsite.webp", link: "https://vision-pro-landing-page.netlify.app/" },
  { name: "Nova Labs", roles: "Experiments, WebGL, Creative Dev", image: "/projects/ThreeJS.webp", link: "https://three-js-challenge-list.vercel.app/" },
];

const ProjectList = () => {
  return (
    <ProjectListClient projects={projects} />
  );
};

export default ProjectList;