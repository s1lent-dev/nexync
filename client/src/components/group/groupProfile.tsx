import React, { useEffect, useState } from "react";
import { X, ChevronRight, ChevronDown, Heart, Trash2, ThumbsDown, LogOut } from "lucide-react";
import Image from "next/image";
import { IGroupChat } from "@/types/types";
import { useGetGroupChats, useLeaveGroupChat, useRemoveMemberFromGroupChat } from "@/hooks/chat";
import { useToast } from "@/context/toast/toast";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { useGetAllConnections } from "@/hooks/user";
import AddMembers from "./addMembers";

interface ProfileProps {
    onClose: () => void;
    group: IGroupChat;
}

const Profile: React.FC<ProfileProps> = ({ onClose, group }) => {
    
    const [showAddMembers, setShowAddMembers] = useState(false);
    const me = useSelector((state: RootState) => state.user.me);
    const connections = useSelector((state: RootState) => state.connection.connections);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const { getAllConnections } = useGetAllConnections();
    const { leaveGroupChat } = useLeaveGroupChat();
    const { removeMemberFromGroupChat } = useRemoveMemberFromGroupChat();
    const { getGroupChats } = useGetGroupChats();
    const { showSuccessToast, showErrorToast } = useToast();
    const toggleShowAllMembers = () => setShowAllMembers(!showAllMembers);

    useEffect(() => {
        getAllConnections();
    }, []);

    const isAdmin = group.members.some((member) => member.userId === me.userId && member.isAdmin);

    const handleRemoveMember = async (memberId: string) => {
        try {
            const res = await removeMemberFromGroupChat(group.chatId, memberId);
            if (res.statusCode === 200) {
                showSuccessToast('Member removed successfully');
                await getGroupChats();
            } else {
                showErrorToast('An error occurred while removing the member');
            }
        } catch (error) {
            console.error(error);
            showErrorToast('An error occurred');
        }
    };

    const handleLeaveGroup = async () => {
        try {
            const res = await leaveGroupChat(group.chatId);
            if (res.statusCode === 200) {
                showSuccessToast('You have left the group successfully');
                await getGroupChats();
            } else {
                showErrorToast('An error occurred while leaving the group');
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredConnections = connections.filter(
        connection => !group.members.some(member => member.userId === connection.userId)
    );

    return (
        <aside className="flex flex-col h-full w-full bg-bg_dark1 shadow-lg overflow-y-scroll custom-scrollbar">
            {/* Sticky Navbar */}
            <nav className="flex items-center gap-5 w-full p-5 bg-bg_card3 shadow sticky top-0 left-0 z-10">
                <X className="text-font_dark cursor-pointer" onClick={onClose} />
                <h4 className="text-base tracking-wide text-font_main">Group info</h4>
            </nav>

            {/* Profile content */}
            <div className="flex flex-col w-full items-center justify-center bg-bg_card3 p-5">
                <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                    <Image
                        src={group.avatarUrl || "/pfp.jpg"}
                        width={200}
                        height={200}
                        alt="desc"
                        className="object-cover w-fit h-fit rounded-full"
                    />
                </div>
                <h2 className="mt-6 font-thin tracking-wider font-sfpro text-font_main text-xl antialiased">
                    {group.name}
                </h2>
                <span className="mt-1 font-thin font-segoe text-font_dark opacity-75 text-base antialiased">
                    Group - {group.members.length} members
                </span>
            </div>

            <div className="flex flex-col gap-3 w-full bg-bg_card3 p-5 mt-3">
                <h4 className="font-segoe text-font_dark font-thin tracking-wide font-lg ml-3">
                    Description
                </h4>
                <p className="ml-3 font-segoe font-thin tracking-wide">
                    {group.tagline || "No bio available"}
                </p>
            </div>

            <div>
                <div className="flex flex-col gap-6 w-full bg-bg_card3 p-5 mt-3">
                    <div className="flex flex-row items-center justify-between">
                        <h4 className="font-segoe text-font_dark font-thin tracking-wide font-lg ml-3">
                            Group members
                        </h4>
                        <div className="flex flex-row gap-2">
                            <span className="font-segoe text-font_dark font-thin">{group.members.length}</span>
                            <ChevronRight width={20} className="text-primary" />
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        {isAdmin && (
                            <>
                            <div className="flex flex-row gap-4 items-center hover:bg-bg_card2 p-2 cursor-pointer relative" onClick={() => setShowAddMembers(true)}>
                                <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-full">
                                    <Image src="/useradd.svg" width={25} height={25} alt="Community" />
                                </div>
                                <h4 className="font-segoe antialiased">Add Members</h4>
                                <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-bg_card2 p-2 cursor-pointer relative">
                                <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-full">
                                    <Image src="/link.svg" width={25} height={25} alt="Community" />
                                </div>
                                <h4 className="font-segoe antialiased">Send Invite link</h4>
                                <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
                            </div>
                            </>
                        )}
                        {(showAllMembers ? group.members : group.members.slice(0, 1)).map((member, index) => (
                            <div
                                key={index}
                                className='flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative'
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
                                            {member.username} {member.isAdmin && <span className="text-xs text-primary ml-1">(Admin)</span>}
                                        </h4>
                                        <span className='text-xs text-gray-500'>10:30 AM</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-sm text-gray-600 truncate'>{member.bio}</p>
                                        {isAdmin && me.userId !== member.userId && (
                                            <Trash2
                                                className="text-error cursor-pointer"
                                                onClick={() => handleRemoveMember(member.userId)}
                                            />
                                        )}
                                    </div>
                                </div>
                                <span className="absolute bottom-0 left-12 right-0 h-[2px] bg-bg_card2" />
                            </div>
                        ))}
                        <div className="flex flex-row gap-2">
                            <span
                                className="font-segoe text-primary font-thin ml-4 cursor-pointer"
                                onClick={toggleShowAllMembers}
                            >
                                {showAllMembers ? "Show less" : "See all"}
                            </span>
                            {showAllMembers ? (
                                <ChevronDown size={20} className="text-primary" />
                            ) : (
                                <ChevronRight size={20} className="text-primary" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Media, links, and other sections */}
            <div className="flex flex-col gap-6 w-full bg-bg_card3 p-5 mt-3">
                <div className="flex flex-row items-center justify-between">
                    <h4 className="font-segoe text-font_dark font-thin tracking-wide font-lg ml-3">
                        Media, links and docs
                    </h4>
                    <div className="flex flex-row gap-2">
                        <span className="font-segoe text-font_dark font-thin">112</span>
                        <ChevronRight width={20} className="text-primary" />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-4 items-center justify-center">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-bg_card2 p-2 w-44">
                            <Image
                                src="/wallpaper.jpg"
                                layout="responsive"
                                width={100}
                                height={100}
                                alt="desc"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col w-full bg-bg_card3 mt-3 mb-3">
                <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full">
                    <Heart className="text-font_dark ml-4" />
                    <span className="font-segoe font-thin text-font_main tracking-wide">Add to favourites</span>
                </div>
                <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full" onClick={handleLeaveGroup}>
                    <LogOut className="text-error ml-4" />
                    <span className="font-segoe font-thin text-error tracking-wide">Exit Group</span>
                </div>
                <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full">
                    <ThumbsDown className="text-error ml-4" />
                    <span className="font-segoe font-thin text-error tracking-wide">Report Group</span>
                </div>
            </div>
            {showAddMembers && <AddMembers connections={filteredConnections} setShowAddMembers={setShowAddMembers} group={group} />}
        </aside>
    );
};

export default Profile;
