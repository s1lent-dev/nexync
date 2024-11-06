import React from "react";
import Image from "next/image";
import { Phone } from "lucide-react";

const SingleConnection = () => {
    return (
        <div className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative">
            <Image
                src={"/pfp.jpg"}
                width={50}
                height={50}
                alt="Profile"
                className="rounded-full"
            />
            <div className="ml-4 flex flex-col flex-grow justify-between">
                <h4 className="font-light tracking-wide text-font_main">username</h4>
                <p className="text-sm text-gray-600 truncate">bio</p>
            </div>
            <div className="flex flex-row gap-5">
                <Phone size={30} strokeWidth={1} className="text-green-600" />
                <button
                    title="Chat"
                    type="button"
                    className="text-font_main flex items-center justify-center rounded-md bg-primary px-3 py-1 text-base outline-none transition-all duration-300"
                    onClick={() => {
                        /* Logic to initiate chat */
                    }}
                >
                    Chat
                </button>
            </div>
            <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
        </div>
    );
};

export default SingleConnection;
