import type { Metadata } from "next";
// import { Geist, Geist_Mono, Anton_SC, Bebas_Neue } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./commonComponents/CustomCursor/CustomCursor";
import { CursorProvider } from "./context/CursorContext";
import { ScrollProvider } from "./context/ScrollContext";
import { LoadingProvider } from "./context/LoadingContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const anton = Anton_SC({
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-anton",
// });

// const bebasNeue = Bebas_Neue({
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-bebas-neue",
//   display: "swap",
// });

export const metadata: Metadata = {
  metadataBase: new URL("https://meethatkar.indevs.in"),
  title: {
    default: "Meet Hatkar — Website Designer & Creative Developer",
    template: "%s | Meet Hatkar",
  },
  description:
    "Meet Hatkar is a website designer and creative developer based in Mumbai, specializing in interactive web experiences with Next.js, Three.js, GSAP, and TypeScript.",
  keywords: [
    "Meet Hatkar",
    "website designer",
    "creative developer",
    "portfolio",
    "Next.js developer",
    "Three.js",
    "GSAP animations",
    "interactive web experiences",
    "Mumbai web developer",
    "frontend developer",
  ],
  authors: [{ name: "Meet Hatkar", url: "https://meethatkar.indevs.in" }],
  creator: "Meet Hatkar",
  publisher: "Meet Hatkar",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meethatkar.indevs.in",
    siteName: "Meet Hatkar Portfolio",
    title: "Meet Hatkar — Website Designer & Creative Developer",
    description:
      "Explore the portfolio of Meet Hatkar — a creative developer crafting interactive, animation-driven web experiences with Next.js, Three.js, and GSAP.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Meet Hatkar Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Hatkar — Website Designer & Creative Developer",
    description:
      "Creative developer crafting interactive web experiences with Next.js, Three.js, and GSAP. Based in Mumbai.",
    creator: "@meethatkar",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden" suppressHydrationWarning>
        <ScrollProvider>
          <LoadingProvider>
            <CursorProvider>
              <CustomCursor />
              <SmoothScroll>
                {children}
              </SmoothScroll>
            </CursorProvider>
          </LoadingProvider>
        </ScrollProvider>
      </body>
    </html>
  );
}
