'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import FloatingImage from '../../commonComponents/floatingImage/FloatingImage';
import Header from '../../commonComponents/Header/Header';

interface Project {
  name: string;
  roles: string;
  image: string;
  link: string;
}

interface ProjectListClientProps {
  projects: Project[];
}

const ProjectListClient = ({ projects }: ProjectListClientProps) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const mouseCoordsRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable hover tracking listeners on desktop screens (width >= 1024px)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return;
    }

    let rafId: number | null = null;
    let isScrolling = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoordsRef.current = { x: e.clientX, y: e.clientY };
    };

    const checkHoverState = () => {
      const { x, y } = mouseCoordsRef.current;
      if (x === 0 && y === 0) return;

      const element = document.elementFromPoint(x, y);
      const projectItem = element?.closest('.project-item');
      
      if (projectItem) {
        const indexAttr = projectItem.getAttribute('data-index');
        if (indexAttr !== null) {
          const index = parseInt(indexAttr, 10);
          const project = projects[index];

          setHoveredProject((prev) => {
            if (prev?.name === project.name) return prev;
            return project;
          });
        }
      } else {
        setHoveredProject((prev) => (prev === null ? prev : null));
      }
      
      isScrolling = false;
    };

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(checkHoverState);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [projects]);

  return (
    <Header
      className="w-full p-[2%] px-[3%]"
      title="Work That Speaks in Pixels"
      description="A curated collection of modern websites and interactive experiences crafted to blend creativity, performance, and conversion-focused design."
    >
      <div
        className="w-full relative"
        onMouseLeave={() => {
          if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setHoveredProject(null);
          }
        }}
      >
        <FloatingImage projects={projects} hoveredProjectName={hoveredProject?.name || null} />

        <div className="border-t border-black/30 flex flex-col">
          {projects.map((project, index) => (
            <div
              key={index}
              data-index={index}
              data-cursor="project"
              className="project-item group flex flex-row items-center justify-between py-6 border-b border-b-gray-400 relative lg:hover:scale-[1.02] lg:hover:-translate-y-1 transition-transform ease-out duration-300"
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  setHoveredProject(project);
                }
              }}
              onClick={() => window.open(project.link, "_blank")}
            >
              {/* Text details container */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 sm:pr-0">
                <h3 className={`font-semibold tracking-tight transition-all duration-500 origin-left text-left ${hoveredProject && hoveredProject.name === project.name
                  ? 'text-[clamp(1.95rem,1.3rem+3.9vw,3.9rem)] text-heading'
                  : hoveredProject
                    ? 'text-[clamp(1.46rem,1.3rem+0.65vw,1.625rem)] text-heading/50'
                    : 'text-[clamp(1.46rem,1.3rem+1vmax,1.5rem)] md:text-[clamp(1.46rem,1.3rem+0.65vw,1.625rem)] lg:text-heading/30 text-heading'
                  }`}>
                  {project.name}
                </h3>
                <p className={`text-[clamp(0.8rem,1.04rem+0.39vw,1rem)] font-medium transition-all duration-500 text-left ${hoveredProject && hoveredProject.name === project.name
                  ? 'text-heading opacity-100'
                  : hoveredProject
                    ? 'text-heading/50'
                    : 'lg:text-heading/50 text-heading/60'
                  }`}>
                  {project.roles}
                </p>
              </div>

              {/* Inline Mobile Thumbnail */}
              <div className="block sm:hidden shrink-0 max-w-46 w-[40vmax] h-[15vmax] rounded-xl overflow-hidden relative border border-black/10">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="112px"
                  className="object-fit"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Header>
  );
};

export default ProjectListClient;
