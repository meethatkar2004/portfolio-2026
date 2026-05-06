import React, { ReactNode } from 'react'

const Header = ({ children, title, description, className }: { children: ReactNode, title: string, description: string, className?: string }) => {
  return (
    <div className={`text-center mb-[3%] space-y-[2%] ${className}`}>
      <h1 className='text-4xl font-bold tracking-tight text-gray-900'>{title}</h1>
      <p className={`text-lg text-gray-600 w-8/12 mx-auto mb-[5%]`}>{description}</p>
      {children}
    </div>
  )
}

export default Header