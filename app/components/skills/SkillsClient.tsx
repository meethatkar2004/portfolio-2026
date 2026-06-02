"use client";

import React, { useState, useEffect } from "react";
import Playful from "../playful/Playful";
import SkillsSpiral from "./SkillsSpiral";

interface SkillItem {
  src: string;
  name: string;
  alt: string;
}

interface SkillsClientProps {
  skills: SkillItem[];
}

const SkillsClient: React.FC<SkillsClientProps> = ({ skills }) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Return a transparent skeleton spacer during SSR / mounting phase
  // to avoid layout shifts or hydration mismatches.
  if (isMobile === null) {
    return (
      <div className="w-full min-h-[50vh] bg-transparent opacity-0" aria-hidden="true" />
    );
  }

  return isMobile ? <SkillsSpiral skills={skills} /> : <Playful />;
};

export default SkillsClient;
