import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton_SC } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./commonComponents/CustomCursor/CustomCursor";
import { CursorProvider } from "./context/CursorContext";
import { ScrollProvider } from "./context/ScrollContext";
import { LoadingProvider } from "./context/LoadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "Meet Portfolio 2026",
  description: "Created by Meet",
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
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
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
