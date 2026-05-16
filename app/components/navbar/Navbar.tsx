import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full p-4 flex items-center justify-between relative'>
      <div className='h-full flex justify-start font-heading'>
        <span className='text-2xl font-extrabold text-primary'>Meet Hatkar</span>
      </div>
      <div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-8 font-heading'>
        <span className='text-lg font-bold text-heading cursor-pointer hover:text-primary transition-colors'>Projects</span>
        <span className='text-lg font-bold text-heading cursor-pointer hover:text-primary transition-colors'>About</span>
        <span className='text-lg font-bold text-heading cursor-pointer hover:text-primary transition-colors'>Skills</span>
        <span className='text-lg font-bold text-heading cursor-pointer hover:text-primary transition-colors'>Contact</span>
      </div>
      <div className='w-2 h-2 rounded-full bg-primary ml-2 shadow-[0_0_8px_rgba(71,106,253,0.6)]'></div>
    </div>
  )
}

export default Navbar