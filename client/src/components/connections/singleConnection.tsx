import React from "react";
import Image from "next/image";
import { CircleChevronRight } from "lucide-react";
import { IUser } from "@/types/types";

const SingleConnection = ({user, setIsSidebar, setSelectedUser} : {user:IUser, setIsSidebar: (status: boolean) => void, setSelectedUser: (user: IUser) => void}) => {

    const handleClick = () => {
        setSelectedUser(user);
        setIsSidebar(true);
    }
    return (
        <div className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative" onClick={handleClick}>
            <Image
                src={ user.avatarUrl || "/pfp.jpg"}
                width={50}
                height={50}
                alt="Profile"
                className="rounded-full"
            />
            <div className="ml-4 flex flex-col flex-grow justify-between">
                <h4 className="font-light tracking-wide text-font_main">{user.username}</h4>
                <p className="text-sm text-gray-600 truncate">followed by sdmrf and 22+ others</p>
            </div>
            <div className="flex flex-row gap-5">
                <CircleChevronRight size={30} strokeWidth={1} className="text-primary" />
            </div>
            <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
        </div>
    );
};

export default SingleConnection;
