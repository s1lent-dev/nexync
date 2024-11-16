import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { IUser } from '@/types/types';
import { useDismissAdmin, useMakeMemberAdmin, useRemoveMemberFromGroupChat } from '@/hooks/chat';
import { useToast } from '@/context/toast/toast';
import { ChevronDown } from 'lucide-react';

interface SingleGroupMemberProps {
    member: IUser;
    isAdmin: boolean;
    me: IUser;
    chatId: string;
}

const SingleGroupMember: React.FC<SingleGroupMemberProps> = ({ member, isAdmin, me, chatId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { removeMemberFromGroupChat } = useRemoveMemberFromGroupChat();
    const { makeMemberAdmin } = useMakeMemberAdmin();
    const { dismissAdmin } = useDismissAdmin();
    const { showSuccessToast, showErrorToast } = useToast();

    const handleRemoveMember = async (memberId: string) => {
        try {
            const res = await removeMemberFromGroupChat(chatId, memberId);
            if (res.statusCode === 200) {
                showSuccessToast('Member removed successfully');
            } else {
                showErrorToast('An error occurred while removing the member');
            }
        } catch (error) {
            console.error(error);
            showErrorToast('An error occurred');
        }
    };

    const handleMakeMemberAdmin = async (memberId: string) => {
        try {
            const res = await makeMemberAdmin(chatId, memberId);
            if (res.statusCode === 200) {
                showSuccessToast('Member is now an admin');
            } else {
                showErrorToast('An error occurred while making the member an admin');
            }
        } catch (error) {
            console.error(error);
            showErrorToast('An error occurred');
        }
    }

    const handleDismissAdmin = async (memberId: string) => {
        try {
            const res = await dismissAdmin(chatId, memberId);
            if (res.statusCode === 200) {
                showSuccessToast('Admin dismissed successfully');
            } else {
                showErrorToast('An error occurred while dismissing the admin');
            }
        } catch (error) {
            console.error(error);
            showErrorToast('An error occurred');
        }
    }

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div
            className='flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                <Image
                    src={member.avatarUrl || "/pfp.jpg"}
                    width={80}
                    height={80}
                    alt="desc"
                    className="object-cover w-fit h-fit rounded-full"
                />
            </div>
            <div className='ml-4 flex flex-col flex-grow justify-between'>
                <div className='flex justify-between'>
                    <h4 className='font-light tracking-wide text-font_main'>
                        {member.username} {member.userId === me.userId && <span className="text-xs text-primary ml-1">(you)</span>}
                    </h4>
                    {member.isAdmin && (
                        <span className='flex items-center gap-2 bg-bg_card1 px-2 py-1 rounded-xl text-xs text-font_main'>Admin</span>
                    )}
                </div>
                <div className='flex justify-between items-center'>
                    <p className='text-sm text-gray-600 truncate'>{member.bio}</p>
                    {isAdmin && me.userId !== member.userId && (
                        <>
                            {isHovered && (
                                <ChevronDown
                                    size={20}
                                    className="text-gray-400 cursor-pointer"
                                    onClick={handleToggleDropdown}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-1 bg-bg_card1 shadow-lg rounded-md p-2 w-40 text-sm z-10"
                    onMouseLeave={() => setIsDropdownOpen(false)} 
                >
                    <ul>
                        {!member.isAdmin ? (
                            <li
                                onClick={() => handleMakeMemberAdmin(member.userId)}
                                className="p-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Make Admin
                            </li>
                        ) : (
                            <li
                                onClick={() => handleDismissAdmin(member.userId)}
                                className="p-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Dismiss Admin
                            </li>
                        )}
                        <li
                            onClick={() => handleRemoveMember(member.userId)}
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                        >
                            Remove
                        </li>
                    </ul>
                </div>
            )}
            <span className="absolute bottom-0 left-12 right-0 h-[2px] bg-bg_card2" />
        </div>
    );
}

export default SingleGroupMember;
