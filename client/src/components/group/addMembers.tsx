import { IGroupChat, IUser } from '@/types/types'
import Image from 'next/image'
import { Check, X } from 'lucide-react'
import React, { useState } from 'react'
import { useAddMembersToGroupChat, useGetGroupChats } from '@/hooks/chat'
import { useToast } from '@/context/toast/toast'

interface AddMembersProps {
    connections: IUser[],
    setShowAddMembers: React.Dispatch<React.SetStateAction<boolean>>,
    group: IGroupChat
}

const AddMembers: React.FC<AddMembersProps> = ({ connections, setShowAddMembers, group }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [memberIds, setMemberIds] = useState<string[]>([]);
    const { addMembersToGroupChat } = useAddMembersToGroupChat();
    const { getGroupChats } = useGetGroupChats();
    const { showSuccessToast, showErrorToast } = useToast();

    const handleCheckboxChange = (userId: string) => {
        setMemberIds((prevIds) =>
            prevIds.includes(userId) ? prevIds.filter(id => id !== userId) : [...prevIds, userId]
        );
    };

    const handleAddMembers = async () => {
        try {
            const res = await addMembersToGroupChat(group.chatId, memberIds);
            if(res.statusCode === 200) {
                showSuccessToast('Members added successfully');
                setShowAddMembers(false);
            } else {
                showErrorToast('Failed to add members');
            }
            await getGroupChats();
        } catch (error) {
            console.error(error);
        }
    }

    const filteredConnections = connections.filter((connection) =>
        connection.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-20">
            <div className="bg-bg_dark2 rounded-lg shadow-lg p-5 w-[90%] max-w-lg relative">
                <div className='w-full p-4 flex flex-row items-center justify-between bg-bg_card2'>
                    <h3 className="text-xl font-thin text-primary">Add Members</h3>
                    <X className="text-gray-500 cursor-pointer" onClick={() => setShowAddMembers(false)} />
                </div>

                {/* Search Bar */}
                <div className="w-full bg-bg_card1 p-2 rounded-lg flex items-center mt-4">
                    <Image src="/search.svg" width={25} height={25} alt="Search Icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-10/12 bg-transparent placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
                    />
                </div>

                {/* Display Selected Members */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {memberIds.map((userId) => {
                        const member = connections.find((connection) => connection.userId === userId);
                        return member ? (
                            <div key={userId} className="flex items-center gap-2 bg-bg_card1 p-2 rounded-lg">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <Image src={member.avatarUrl || "/pfp.jpg"} width={32} height={32} alt="Profile Picture" />
                                </div>
                                <span className="text-font_main">{member.username}</span>
                                <X className="text-font_light cursor-pointer" onClick={() => handleCheckboxChange(userId)} />
                            </div>
                        ) : null;
                    })}
                </div>

                {/* List of Filtered Connections */}
                <div className="flex flex-col gap-4 mt-4">
                    {filteredConnections.map((connection) => (
                        <div key={connection.userId} className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative">
                            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                <Image
                                    src={connection.avatarUrl || "/pfp.jpg"}
                                    width={50}
                                    height={50}
                                    alt="Profile Picture"
                                    className="object-cover w-fit h-fit rounded-full"
                                />
                            </div>
                            <div className="ml-4 flex flex-col flex-grow justify-between">
                                <h4 className="font-light tracking-wide text-font_main">{connection.username}</h4>
                                <p className="font-thin text-font_light opacity-75 text-sm">{connection.bio}</p>
                            </div>
                            <div
                                onClick={() => handleCheckboxChange(connection.userId)}
                                className={`w-4 h-4 rounded-full border-2 border-font_light cursor-pointer transition-colors ${memberIds.includes(connection.userId) ? 'bg-primary' : 'bg-transparent'}`}
                            />
                        </div>
                    ))}
                </div>
                <button type="button" title='create group' className="mt-4 p-3 bg-primary text-font_main rounded-full flex items-center justify-center mx-auto" onClick={handleAddMembers}>
                        <Check size={24} />
                </button>
            </div>
        </div>
    );
};

export default AddMembers;
