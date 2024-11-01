import React from 'react'
import Image from 'next/image'
const Profile = () => {
  return (
    <section className='flex flex-col p-4 w-full gap-10 h-full'>
        <div className='flex flex-col gap-10'>
            <h1 className='w-full font-bold font-sfpro text-font_main text-pretty text-xl antialiased'>Profile</h1>
            <div className='w-full flex items-center justify-center'><Image src='/pfp.jpg' width={200} height={200} alt='desc' className='rounded-full' /></div>
        </div>
        <div className='flex flex-col w-full gap-6 p-4'>
        <div className='flex flex-col w-full gap-4'>
          <h6 className='font-thin text-primary tracking-wider text-sm opacity-80'>Username</h6>
          <div className='w-full flex flex-row items-center justify-between gap-4'>
            <span>Paresh Deshpande</span>
            <Image src='/pen.svg' width={25} height={25} alt='desc'/>
          </div>
          <p className='text-font_dark font-thin tracking-wide text-sm'>This is your username. This will be visible to all of your connections</p>
        </div>
        <div className='flex flex-col w-full gap-4'>
          <h6 className='font-thin text-primary tracking-wider text-sm opacity-80'>About</h6>
          <div className='w-full flex flex-row items-center justify-between gap-4'>
            <span>Sometimes your freinds can let you down but once i a whille they are the only reason that you are standing up</span>
            <Image src='/pen.svg' width={25} height={25} alt='desc'/>
          </div>
        </div>
        </div>
    </section>
  )
}

export default Profile
