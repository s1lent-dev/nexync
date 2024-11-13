import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Camera, Check, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetAllConnections } from '@/hooks/user';
import { useCreateGroupChat, useGetGroupChats } from '@/hooks/chat';
import { RootState } from '@/context/store';
import { useToast } from '@/context/toast/toast';

interface GroupDetailsFormData {
    name: string;
    tagline: string;
    photo: File | null;
    memberIds: string[];
}

// Combined Zod schema for both member selection and group creation
const groupSchema = z.object({
    name: z.string().min(6, "Group name is required").optional(),
    tagline: z.string().min(3, "Tagline is required").optional(),
    photo: z.any().refine((file) => file instanceof File || file === null, {
        message: "Please upload a valid image",
    }).optional(),
    memberIds: z.array(z.string()).nonempty("Please select at least one member"),
});

const NewGroup = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showGroupDetailsForm, setShowGroupDetailsForm] = useState(false);
    const connections = useSelector((state: RootState) => state.connection.connections);
    const { getGroupChats } = useGetGroupChats();
    const { getAllConnections } = useGetAllConnections();
    const { createGroupChat } = useCreateGroupChat();
    const { showSuccessToast, showErrorToast } = useToast();

    // Use one form hook for everything
    const {
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<GroupDetailsFormData>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: '',
            tagline: '',
            photo: null,
            memberIds: [],
        },
    });

    useEffect(() => {
        getAllConnections();
    }, []);

    const memberIds = watch("memberIds");

    const handleCheckboxChange = (userId: string) => {
        setValue(
            "memberIds",
            memberIds.includes(userId)
                ? memberIds.filter((id) => id !== userId)
                : [...memberIds, userId]
        );
    };

    const filteredConnections = connections.filter((connection) =>
        connection.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProceed = () => {
        setShowGroupDetailsForm(true);
    };

    const handleCreateGroup = async (data: GroupDetailsFormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("tagline", data.tagline);
        data.memberIds.forEach((id) => formData.append("memberIds", id));
        if (data.photo) formData.append("photo", data.photo);

        try {
            const res = await createGroupChat(formData);
            if (res.statusCode === 201) {
                showSuccessToast("Group created successfully");
            } else {
                showErrorToast("Failed to create group");
            }
            await getGroupChats();
            setShowGroupDetailsForm(false);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const removeMember = (userId: string) => {
        setValue("memberIds", memberIds.filter(id => id !== userId));
    };

    return (
        <section className="flex flex-col p-6 w-full gap-6 h-full flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin">
            {!showGroupDetailsForm ? (
                <>
                    <div className="flex flex-row gap-8">
                        <h4 className="font-sfpro text-font_dark text-xl font-thin">
                            Create New Group
                        </h4>
                    </div>
                    <div className="w-full bg-bg_card1 p-1 rounded-lg flex items-center">
                        <Image src="/search.svg" width={25} height={25} alt="Search Icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-10/12 bg-transparent placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="font-segoe text-primary text-xl tracking-widest ml-6 font-thin opacity-75">
                            Add Members
                        </h2>
                        <div className="pr-2 space-y-2">
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
                                        className={`w-4 h-4 rounded-full border-2 border-font_light cursor-pointer transition-colors
                                            ${memberIds.includes(connection.userId) ? 'bg-primary' : 'bg-transparent'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type='button'
                        title='Add members to group'
                        onClick={handleProceed}
                        className="mt-4 p-3 bg-primary text-font_main rounded-full flex items-center justify-center mx-auto"
                    >
                        <ArrowRight size={24} />
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit(handleCreateGroup)} className="flex flex-col gap-6">
                    <h4 className="font-sfpro text-font_dark text-xl font-thin">
                        Group Details
                    </h4>

                    <div className='flex flex-wrap gap-4'>
                        {memberIds.map((memberId) => {
                            const member = connections.find((connection) => connection.userId === memberId);
                            return member ? (
                                <div key={member.userId} className="flex items-center gap-2 bg-bg_card1 p-2 rounded-lg">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <Image
                                            src={member.avatarUrl || "/pfp.jpg"}
                                            width={32}
                                            height={32}
                                            alt="Profile Picture"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <span className="text-font_main">{member.username}</span>
                                    <X
                                        size={18}
                                        className="text-font_light cursor-pointer"
                                        onClick={() => removeMember(member.userId)}
                                    />
                                </div>
                            ) : null;
                        })}
                    </div>

                    <div className='w-full flex items-center justify-center relative'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                            <Image
                                src={'/pfp.jpg'}
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
                                    {...register("photo")}
                                    type="file"
                                    className="hidden"
                                    title='Upload a new profile picture'
                                />
                            </label>
                        )}
                    </div>
                    {errors.photo && <p className="text-red-500">{errors.photo.message}</p>}

                    <div className='flex flex-col mt-12 w-full'>
                        <input
                            type="text"
                            placeholder="Group Name"
                            {...register("name")}
                            className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none`}
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className='flex flex-col mt-4 w-full'>
                        <input
                            type="text"
                            placeholder="Tagline"
                            {...register("tagline")}
                            className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none`}
                        />
                        {errors.tagline && <p className="text-red-500">{errors.tagline.message}</p>}
                    </div>

                    <button type="submit" title='create group' className="mt-4 p-3 bg-primary text-font_main rounded-full flex items-center justify-center mx-auto">
                        <Check size={24} />
                    </button>
                </form>
            )}
        </section>
    );
};

export default NewGroup;
