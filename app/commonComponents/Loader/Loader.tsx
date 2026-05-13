import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react'

const Loader = () => {
  const GreenDiv = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<HTMLDivElement>(null);

  useGSAP(()=>{
    const tl = gsap.timeline();
    tl.to(fullScreen.current, {
      height: '0vh',
      duration: 2,
      ease: "expo.inOut"
    })
    tl.to(GreenDiv.current, {
      height: "100vh",
      ease: "expo.inOut",
      duration: 2,
    }, "0")
    tl.to(GreenDiv.current, {
      top:"0",
      height: "0%",
      ease: "expo.inOut",
      duration: 1,
      delay: -0.5,
    })
  })
  
  return (
    <div id="main" className='relative w-screen h-screen'>
      <div ref={fullScreen} id="loader" className='w-screen h-screen bg-gray-400 text-white relative overflow-hidden'>
        <div id="top-heading" className=' absolute top-[2.5%] left-1/2 -translate-x-1/2 text-center uppercase w-full font-semibold'>
          <h1>Web Designer & Developer</h1>
          <h5> &copy; 2026 </h5>
        </div>
      </div>
      <div ref={GreenDiv} id="green" className='absolute bottom-0 w-full h-0 bg-green-400'></div>
    </div>
  )
}

export default Loader