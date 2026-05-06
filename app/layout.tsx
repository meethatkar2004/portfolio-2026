import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./commonComponents/CustomCursor/CustomCursor";
import { CursorProvider } from "./context/CursorContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CursorProvider>
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </CursorProvider>
      </body>
    </html>
  );
}
