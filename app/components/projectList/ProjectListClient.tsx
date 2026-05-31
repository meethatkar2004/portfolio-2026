'use client';
import React, { useState, useEffect, useRef } from 'react';
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
    const handleMouseMove = (e: MouseEvent) => {
      mouseCoordsRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { x, y } = mouseCoordsRef.current;
      if (x === 0 && y === 0) return; // Mouse hasn't moved on the viewport yet

      const element = document.elementFromPoint(x, y);
      if (!element) return;

      const projectItem = element.closest('.project-item');
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
        setHoveredProject((prev) => {
          if (prev === null) return prev;
          return null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
          setHoveredProject(null);
        }}
      >
        <FloatingImage projects={projects} hoveredProjectName={hoveredProject?.name || null} />

        <div className="border-t border-black/30 flex flex-col">
          {projects.map((project, index) => (
            <div
              key={index}
              data-index={index}
              data-cursor="project"
              className="project-item group flex flex-col sm:flex-row sm:items-center justify-between py-6 sm:py-8 border-b border-b-gray-400 relative hover:scale-[1.02] hover:-translate-y-1 transition-transform ease-out duration-300"
              onMouseEnter={() => {
                setHoveredProject(project);
              }}
              onClick={() => window.open(project.link, "_blank")}
            >
              <h3 className={`font-semibold tracking-tight transition-all duration-500 origin-left ${hoveredProject && hoveredProject.name === project.name
                ? 'text-2xl sm:text-5xl text-heading'
                : hoveredProject
                  ? 'text-lg sm:text-xl text-heading/50'
                  : 'text-lg sm:text-xl text-heading/30'
                }`}>
                {project.name}
              </h3>
              <p className={`text-sm sm:text-base font-medium transition-all duration-500 ${hoveredProject && hoveredProject.name === project.name
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

export default ProjectListClient;
