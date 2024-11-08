import React, { useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/context/store';
import { useGetMe, useUpdateBio, useUploadAvatar } from '@/utils/api';
import { Camera, SendHorizontal } from 'lucide-react';
import { useToast } from '@/context/toast/toast';

const Profile = () => {
  const { showSuccessToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const user = useSelector((state: RootState) => state.user.me);
  const { uploadAvatar } = useUploadAvatar();
  const { updateBio } = useUpdateBio();
  const { getMe } = useGetMe();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      uploadAvatar(formData);
      showSuccessToast('Profile picture updated');
      await getMe();
    }
  };

  const handleUsernameSave = () => {
    setIsEditingUsername(false);
  };

  const handleBioSave = async () => {
    await updateBio(bio);
    showSuccessToast('Bio updated successfully');
    await getMe();
    setIsEditingBio(false);
  };

  return (
    <section className='flex flex-col p-4 w-full gap-10 h-full'>
      <div className='flex flex-col gap-10'>
        <h1 className='w-full font-bold font-sfpro text-font_main text-pretty text-xl antialiased'>Profile</h1>
        <div className='w-full flex items-center justify-center relative'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
            <Image
              src={user.avatarUrl || '/pfp.jpg'}
              width={200}
              height={200}
              alt="Profile Picture"
              className={`object-cover w-full h-full transition-opacity duration-300 ${isHovered ? 'opacity-50 blur-sm' : 'opacity-100'}`}
            />
          </div>
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
            {isEditingUsername ? (
              <>
                <input
                  type="text"
                  title='Edit your username'
                  placeholder='Edit your username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-10/12 bg-transparent border-b border-b-primary placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
                />
                <SendHorizontal className='text-primary cursor-pointer' onClick={handleUsernameSave} />
              </>
            ) : (
              <>
                <span>{user.username}</span>
                <Image
                  src='/pen.svg'
                  width={25}
                  height={25}
                  alt='Edit Username'
                  onClick={() => {
                    setIsEditingUsername(true);
                    setUsername(user.username);
                  }}
                  className='cursor-pointer'
                />
              </>
            )}
          </div>
          <p className='text-font_dark font-thin tracking-wide text-sm'>This is your username. This will be visible to all of your connections</p>
        </div>

        <div className='flex flex-col w-full gap-4'>
          <h6 className='font-thin text-primary tracking-wider text-sm opacity-80'>About</h6>
          <div className='w-full flex flex-row items-center justify-between gap-4'>
            {isEditingBio ? (
              <>
                <input
                  type="text"
                  title='Edit your bio'
                  placeholder='Edit your bio'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-10/12 bg-transparent border-b border-b-primary placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
                />
                <SendHorizontal className='text-primary cursor-pointer' onClick={handleBioSave} />
              </>
            ) : (
              <>
                <span>{user.bio}</span>
                <Image
                  src='/pen.svg'
                  width={25}
                  height={25}
                  alt='Edit Bio'
                  onClick={() => {
                    setIsEditingBio(true);
                    setBio(user.bio);
                  }}
                  className='cursor-pointer'
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
