import Image from "next/image";
import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import Hero from "./components/Hero/Hero";
import HeroText from "./components/heroText/HeroText";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans w-full relative">
      <Hero />
      {/* <HeroText /> */}
      <ProjectList />
      <CertificateCard />
    </div>
  );
}
