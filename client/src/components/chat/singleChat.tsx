"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

const SingleChat = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className='flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src='/pfp.jpg' width={50} height={50} alt='desc' className="rounded-full" />
      <div className='ml-4 flex flex-col flex-grow justify-between'>
        <div className='flex justify-between'>
          <h4 className='font-light tracking-wide text-font_main'>Username</h4>
          <span className='text-xs text-gray-500'>10:30 AM</span>
        </div>
        <div className='flex justify-between items-center'>
          <p className='text-sm text-gray-600 truncate'>Last message in the chat goes here...</p>
          {isHovered && <ChevronDown size={20} className="text-gray-400" />}
        </div>
      </div>

      {/* Custom Border */}
      <span className="absolute bottom-0 left-12 right-0 h-[2px] bg-bg_card2" />
    </div>
  )
}

export default SingleChat
