import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/context/store';
import { useGetMe, useUploadAvatar } from '@/utils/api';
import { Camera } from 'lucide-react';

const Profile = () => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state: RootState) => state.User.user);
  const { getMe } = useGetMe();
  const { uploadAvatar } = useUploadAvatar();

  useEffect(() => {
    getMe();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      uploadAvatar(formData);
    }
  };

  return (
    <section className='flex flex-col p-4 w-full gap-10 h-full'>
      <div className='flex flex-col gap-10'>
        <h1 className='w-full font-bold font-sfpro text-font_main text-pretty text-xl antialiased'>Profile</h1>
        <div className='w-full flex items-center justify-center relative' 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image 
            src={user.avatarUrl || '/pfp.jpg'} 
            width={200} 
            height={200} 
            alt='Profile Picture' 
            className={`rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
          />
          {isHovered && (
            <label 
              htmlFor="file-upload" 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <Camera className="text-white bg-primary rounded-full p-2" size={40} />
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                title='Upload a new profile picture'
              />
            </label>
          )}
        </div>
      </div>
      <div className='flex flex-col w-full gap-6 p-4'>
        <div className='flex flex-col w-full gap-4'>
          <h6 className='font-thin text-primary tracking-wider text-sm opacity-80'>Username</h6>
          <div className='w-full flex flex-row items-center justify-between gap-4'>
            <span>{user.username}</span>
            <Image src='/pen.svg' width={25} height={25} alt='Edit Username' />
          </div>
          <p className='text-font_dark font-thin tracking-wide text-sm'>This is your username. This will be visible to all of your connections</p>
        </div>
        <div className='flex flex-col w-full gap-4'>
          <h6 className='font-thin text-primary tracking-wider text-sm opacity-80'>About</h6>
          <div className='w-full flex flex-row items-center justify-between gap-4'>
            <span>{user.bio}</span>
            <Image src='/pen.svg' width={25} height={25} alt='Edit About' />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
