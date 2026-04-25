import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'

const Header = () => {
  return (
     <div className="flex h-14 w-full flex-row justify-end items-center border-b border-border/50 bg-sidebar/60 backdrop-blur-md px-4 py-2 z-10 relative">
        <ModeToggle/>
     </div>
  )
}

export default Header