import React from 'react'
import Image from 'next/image'
const Navigation = () => {
  return (
    <aside className='bg-bg_card1 h-full flex flex-col items-center justify-between p-4 shadow-sm shadow-font_light'>
      <div className='flex flex-col gap-6'>
        <Image src='/chat.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/status.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/channel.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/community.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/archive.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
      </div>
      <div className='flex flex-col gap-6'>
        <Image src='/settings.svg' width={30} height={30} alt='desc' className='cursor-pointer' />
        <Image src='/pfp.jpg' width={35} height={35} style={{borderRadius: '50%', color: 'white'}} alt='desc' className='cursor-pointer' />
      </div>
    </aside>
  )
}

export default Navigation
