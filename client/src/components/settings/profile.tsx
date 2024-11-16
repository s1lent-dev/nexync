import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/context/store';
import { useGetMe, useUpdateBio, useUpdateUsername, useUploadAvatar } from '@/hooks/user';
import { useCheckUsername } from '@/hooks/auth';
import { Camera, SendHorizontal } from 'lucide-react';
import { useToast } from '@/context/toast/toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash';

const usernameSchema = z.object({
  username: z.string().min(6, 'Username must be at least 6 characters'),
});

const Profile = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const user = useSelector((state: RootState) => state.user.me);
  const { updateUsername } = useUpdateUsername();
  const { uploadAvatar } = useUploadAvatar();
  const { updateBio } = useUpdateBio();
  const { getMe } = useGetMe();
  const { checkUsername } = useCheckUsername();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user.username || '',
    },
  });

  const username = watch('username');

  const debouncedCheckUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 6) {
        const res = await checkUsername(username);
        setError("username", {
          type: "manual",
          message: res,
        });
      } else {
        setError("username", {
          type: "manual",
          message: "Username must be at least 6 characters",
        });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (isEditingUsername && username) {
      debouncedCheckUsername(username);
    } else {
      clearErrors('username');
    }
  }, [username, debouncedCheckUsername, clearErrors, isEditingUsername]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(event.target as Element).closest('.username-edit-container') &&
        !(event.target as Element).closest('form')
      ) {
        setIsEditingUsername(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUsernameSave = async (data: { username: string }) => {
    if (errors.username?.message?.includes('exists')) {
      showErrorToast('Username already taken');
      return;
    }
    const res = await updateUsername(data.username);
    if (res.statusCode === 200) {
      showSuccessToast(res.message);
    } else {
      showErrorToast(res.message)
    }
    await getMe();
    setIsEditingUsername(false);
  };

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

  const handleBioSave = async () => {
    await updateBio(bio);
    showSuccessToast('Bio updated successfully');
    await getMe();
    setIsEditingBio(false);
  };

  return (
    <section className="flex flex-col p-4 w-full gap-10 h-full">
      <div className="flex flex-col gap-10">
        <h1 className="w-full font-bold font-sfpro text-font_main text-pretty text-xl antialiased">
          Profile
        </h1>
        <div
          className="w-full flex items-center justify-center relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
            <Image
              src={user.avatarUrl || '/pfp.jpg'}
              width={200}
              height={200}
              alt="Profile Picture"
              className={`object-cover w-full h-full transition-opacity duration-300 ${isHovered ? 'opacity-50 blur-sm' : 'opacity-100'
                }`}
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
                title="Upload a new profile picture"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full gap-6 p-4">
        <form
          onSubmit={handleSubmit(handleUsernameSave)}
          className="flex flex-col gap-4 username-edit-container"
        >
          <h6 className="font-thin text-primary tracking-wider text-sm opacity-80">
            Username
          </h6>
          <div className="w-full flex items-center gap-4">
            {isEditingUsername ? (
              <>
                <div className='flex flex-col w-full'>
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="Enter your username"
                    className={`w-10/12 bg-transparent border-b placeholder:text-font_light placeholder:font-thin focus:outline-none ${errors.username?.message?.includes("already") ? "border-red-500" : "border-primary"
                      }`}
                  />
                  {errors.username && (
                    <p
                      className={`${errors.username.message?.includes("available") ? "text-green-500" : "text-red-500"
                        } text-sm mt-1`}
                    >
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <button type="submit" className="text-primary" title="Save Username">
                  <SendHorizontal size={24} />
                </button>
              </>
            ) : (
              <>
                <span className="w-10/12">{user.username}</span>
                <Image
                  src="/pen.svg"
                  width={25}
                  height={25}
                  alt="Edit Username"
                  onClick={() => setIsEditingUsername(true)}
                  className="cursor-pointer"
                />
              </>
            )}
          </div>
          <p className="text-font_dark font-thin tracking-wide text-sm">
            This is your username. This will be visible to all of your connections.
          </p>
        </form>

        <div className="flex flex-col w-full gap-4">
          <h6 className="font-thin text-primary tracking-wider text-sm opacity-80">About</h6>
          <div className="w-full flex flex-row items-center justify-between gap-4">
            {isEditingBio ? (
              <>
                <input
                  type="text"
                  title="Edit your bio"
                  placeholder="Edit your bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBioSave();
                  }}
                  className="w-10/12 bg-transparent border-b border-b-primary placeholder:text-font_light placeholder:font-thin ml-2 focus:outline-none"
                />
                <SendHorizontal
                  className="text-primary cursor-pointer"
                  onClick={handleBioSave}
                />
              </>
            ) : (
              <>
                <span>{user.bio}</span>
                <Image
                  src="/pen.svg"
                  width={25}
                  height={25}
                  alt="Edit Bio"
                  onClick={() => {
                    setIsEditingBio(true);
                    setBio(user.bio);
                  }}
                  className="cursor-pointer"
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
