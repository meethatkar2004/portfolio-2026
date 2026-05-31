import React, { ReactNode } from 'react'

interface HeaderProps {
  children: ReactNode;
  title: string;
  description?: ReactNode;
  className?: string;
  titleClass?: string;
  descClass?: string;
}

const Header = ({ children, title, description, className, titleClass, descClass }: HeaderProps) => {
  return (
    <div className={`text-center mb-[3%] space-y-[2%] ${className}`}>
      <h1 className={`text-4xl font-bold tracking-tight ${titleClass}`}>{title}</h1>
      <p className={`text-lg text-gray-600 w-8/12 mx-auto mb-[5%] ${descClass}`}>{description}</p>
      {children}
    </div>
  )
}

export default Header