"use client"
import React from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { setNavigation } from '@/context/reducers/navigation'
import { RootState } from '@/context/store'

const Navigation = () => {
  
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch()

  return (
    <aside className='bg-bg_card1 h-full flex flex-col items-center justify-between p-4 shadow-sm shadow-font_light'>
      <div className='flex flex-col gap-6'>
        <Image src='/chat.svg' width={25} height={25} alt='desc' className='cursor-pointer' onClick={() => dispatch(setNavigation('chat'))}/>
        <Image src='/status.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/channel.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/community.svg' width={25} height={25} alt='desc' className='cursor-pointer' onClick={() => dispatch(setNavigation('connections'))}/>
        <Image src='/archive.svg' width={25} height={25} alt='desc' className='cursor-pointer'/>
        <Image src='/meta.png' width={25} height={25} alt='desc' className='cursor-pointer'/>
      </div>
      <div className='flex flex-col gap-6'>
        <Image src='/settings.svg' width={30} height={30} alt='desc' className='cursor-pointer' onClick={() => dispatch(setNavigation('settings'))} />
        <Image src={me.avatarUrl || '/pfp.jpg'} width={35} height={35} style={{borderRadius: '50%', color: 'white'}} alt='desc' className='cursor-pointer' onClick={() => dispatch(setNavigation('profile'))} />
      </div>
    </aside>
  )
}

export default Navigation
