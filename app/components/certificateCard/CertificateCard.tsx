import CertificateCardClient from "./CertificateCardClient";

export default function CertificateCard() {
  const certificateData = [
    {
      title: "SEO",
      description: "Optimized websites for higher rankings using advanced SEO, keyword strategy, and technical performance improvements.",
      image: "/certificates/seo-yellow.webp",
      issueDate: "7-25",
      issueBy: "MOZ",
      link: "https://www.linkedin.com/learning/certificates/2583a0e52ca6a3a496403f5205b27a9ce4393258c5532a1589f09639773b8048/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3B6F1mzBjIR1muWDlrpc7YhA%3D%3D"
    },
    {
      title: "Three.js",
      description: "Built immersive 3D web experiences using Three.js, creating visually stunning, interactive websites.",
      image: "/certificates/ThreeJSBlur.webp",
      issueDate: "04-26",
      issueBy: "Sheryains Coding School",
      link: "https://sheryians.com/certificate/2085873512282417"
    },
    {
      title: "Git & Github",
      description: "Streamlined development workflows with Git, GitHub, and automation tools for efficient project delivery.",
      image: "/certificates/github-yellow.webp",
      issueDate: "6-25",
      issueBy: "Github",
      link: "https://www.linkedin.com/learning/certificates/baa0c2c86b9e8cd9de83186e6afeade4b9aee2b7836779aeef54ef6f6504e6a1/?trk=share_certificate&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3B6F1mzBjIR1muWDlrpc7YhA%3D%3D"
    }
  ];

  return <CertificateCardClient certificateData={certificateData} />;
}
