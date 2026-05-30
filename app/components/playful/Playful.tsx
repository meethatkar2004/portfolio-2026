"use client";
import React from 'react'
import Eye from './Eye'
import ImageTrail from '../imageTrail/ImageTrail';
import { useLoading } from '../../context/LoadingContext';

const Playful = () => {
  const { isLoading } = useLoading();
  return (
    <div className='w-full h-screen overflow-hidden relative z-0'>
      <div className='absolute w-full h-full inset-0 bg-linear-to-b from-transparent via-transparent to-[#343434] z-200'></div>
      <ImageTrail enabled={!isLoading} />
      <div className='h-full w-full flex items-center justify-center relative'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-[2vmax] z-200'>
          {/* 1st eye */}
          <Eye key_val={1} />
          {/* 2nd eye */}
          <Eye key_val={2} />
        </div>
      </div>
    </div>
  )
}

export default Playful


