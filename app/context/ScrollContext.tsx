'use client';
import React, { createContext, useContext, useState } from 'react';

interface ScrollContextType {
  isPinned: boolean;
  setIsPinned: (value: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  isPinned: false,
  setIsPinned: () => {},
});

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <ScrollContext.Provider value={{ isPinned, setIsPinned }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
