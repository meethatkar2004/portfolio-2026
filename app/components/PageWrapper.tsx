"use client";

import React, { useRef } from "react";
import InitialLoad from "../commonComponents/Loader/InitialLoad";
import { useLoading } from "../context/LoadingContext";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, setIsLoading } = useLoading();
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main
      ref={mainRef}
      id="main-wrapper"
      className="relative flex flex-col items-center w-full"
    >
      <InitialLoad onComplete={() => setIsLoading(false)} />
      <div className={`relative ${isLoading ? "opacity-0 invisible h-screen overflow-hidden" : "opacity-100 w-full"}`}>
        {children}
      </div>
    </main>
  );
}
