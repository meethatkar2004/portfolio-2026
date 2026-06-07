import dynamic from "next/dynamic";
import ProjectList from "./components/projectList/ProjectList";
import HeroText from "./components/heroText/HeroText";
import Footer from "./components/footer/Footer";

import PageWrapper from "./components/PageWrapper";
import BottomSectionWrapper from "./components/BottomSectionWrapper";

// Lazy-load below-the-fold heavy components to reduce initial JS bundle
const CertificateCard = dynamic(
  () => import("./components/certificateCard/CertificateCard")
);
const Skills = dynamic(
  () => import("./components/skills/Skills")
);
const HorizontalText = dynamic(
  () => import("./components/horizontalText/HorizontalText")
);
const Whyme = dynamic(
  () => import("./components/whyMe/Whyme")
);
const Contact = dynamic(
  () => import("./components/contact/Contact")
);

// JSON-LD Structured Data for SEO
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Meet Hatkar",
  jobTitle: "Website Designer & Creative Developer",
  url: "https://meethatkar.dev",
  image: "https://meethatkar.dev/logo.png",
  description:
    "Website designer and creative developer based in Mumbai, specializing in interactive web experiences with Next.js, Three.js, GSAP, and TypeScript.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/in/meethatkar/",
    "https://www.instagram.com/hatkarmeet/",
    "https://github.com/meethatkar",
  ],
  knowsAbout: [
    "Next.js",
    "TypeScript",
    "Three.js",
    "GSAP",
    "Tailwind CSS",
    "React",
    "Web Design",
    "Creative Development",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Meet Hatkar Portfolio",
  url: "https://meethatkar.dev",
  description:
    "Portfolio of Meet Hatkar — a creative developer crafting interactive, animation-driven web experiences.",
  author: {
    "@type": "Person",
    name: "Meet Hatkar",
  },
};

export default function Home() {
  return (
    <PageWrapper>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />

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

