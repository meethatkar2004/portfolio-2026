import Image from "next/image";
import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <ProjectList />
      <CertificateCard />
    </div>
  );
}
