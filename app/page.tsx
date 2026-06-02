import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import Skills from "./components/skills/Skills";
import HeroText from "./components/heroText/HeroText";
import Whyme from "./components/whyMe/Whyme";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import HorizontalText from "./components/horizontalText/HorizontalText";

import PageWrapper from "./components/PageWrapper";
import BottomSectionWrapper from "./components/BottomSectionWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div id="projectList" className="w-full">
        <ProjectList />
      </div>
      <div id="memorable" className="w-full">
        <HorizontalText />
      </div>
      <div id="certificates" className="w-full">
        <CertificateCard />
      </div>
      <div id="whyme" className="w-full">
        <Whyme />
      </div>
      <div id="skills" className="w-full">
        <Skills />
      </div>
      <div id="contact" className="w-full">
        <Contact />
      </div>

      <BottomSectionWrapper>
        <div className="relative w-full py-[12vh] md:py-[15vh] overflow-hidden flex flex-col gap-6 md:gap-12 justify-center select-none md:pb-[20%]">
          <HeroText
            speed={5}
            direction="left"
            textArray={["CREATIVE • CODE • CULTURE"]}
          />
        </div>
        <Footer />
      </BottomSectionWrapper>
    </PageWrapper>
  );
}
