import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import Playful from "./components/playful/Playful";
import HeroText from "./components/heroText/HeroText";
import Whyme from "./components/whyMe/Whyme";
import Footer from "./components/footer/Footer";

import PageWrapper from "./components/PageWrapper";
import BottomSectionWrapper from "./components/BottomSectionWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <ProjectList />
      <CertificateCard />
      <Whyme />
      <Playful />

      <BottomSectionWrapper>
        <div className="relative w-full py-[12vh] md:py-[15vh] overflow-hidden flex flex-col gap-6 md:gap-12 justify-center select-none md:pb-[20%]">
          <HeroText
            speed={10}
            direction="left"
            textArray={[
              "FORGET NORMAL CREATE IMPACT",
              "BREAK THE ORDINARY BUILD THE UNFORGETTABLE"
            ]}
          />
          <HeroText
            speed={10}
            direction="right"
            textArray={[
              "KING IS EXPERIENCE DEAD IS ORIDNARY",
              "OBSESSION TURN CLICK INTO OBSESSION",
            ]}
          />
        </div>
        <Footer />
      </BottomSectionWrapper>
    </PageWrapper>
  );
}
