import React from "react";
import SkillsClient from "./SkillsClient";

// Static data initialized outside client code (Next.js Server Component)
const SKILLS = [
  { src: "/skills/next_js.webp", name: "NEXT.JS", alt: "Next.js logo" },
  { src: "/skills/typescript.webp", name: "TYPESCRIPT", alt: "TypeScript logo" },
  { src: "/skills/three_js.webp", name: "THREE.JS", alt: "Three.js logo" },
  { src: "/skills/tailwind_css.webp", name: "TAILWIND CSS", alt: "Tailwind CSS logo" },
  { src: "/skills/redux.webp", name: "REDUX", alt: "Redux logo" },
  { src: "/skills/python.webp", name: "PYTHON", alt: "Python logo" },
  { src: "/skills/docker.webp", name: "DOCKER", alt: "Docker logo" },
  { src: "/skills/github.webp", name: "GITHUB", alt: "GitHub logo" },
  { src: "/skills/grafana.webp", name: "GRAFANA", alt: "Grafana logo" }
];

const Skills = () => {
  return <SkillsClient skills={SKILLS} />;
};

export default Skills;
