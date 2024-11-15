import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { ChevronRight, Heart, Ban, ThumbsDown, Trash2 } from "lucide-react";
import { IConnectionChat } from "@/types/types";

interface ProfileProps {
  onClose: () => void;
  user: IConnectionChat;
}

const Profile: React.FC<ProfileProps> = ({ onClose, user }) => {
  return (
    <aside className="flex flex-col h-full w-full bg-bg_dark1 shadow-lg overflow-y-scroll custom-scrollbar">
      {/* Sticky Navbar */}
      <nav className="flex items-center gap-5 w-full p-5 bg-bg_card3 shadow sticky top-0 left-0 z-10">
        <X className="text-font_dark cursor-pointer" onClick={onClose} />
        <h4 className="text-base tracking-wide text-font_main">Friend Info</h4>
      </nav>

      {/* Profile content */}
      <div className="flex flex-col w-full items-center justify-center bg-bg_card3 p-5">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
          <Image
            src={user.avatarUrl || "/pfp.jpg"}
            width={200}
            height={200}
            alt="desc"
            className="object-cover w-fit h-fit rounded-full"
          />
        </div>
        <h2 className="mt-6 font-thin tracking-wider font-sfpro text-font_main text-xl antialiased">
          {user.username}
        </h2>
        <span className="mt-1 font-thin font-segoe text-font_dark opacity-75 text-base antialiased">
          {user.email}
        </span>
      </div>

      <div className="flex flex-col gap-3 w-full bg-bg_card3 p-5 mt-3">
        <h4 className="font-segoe text-font_dark font-thin tracking-wide font-lg ml-3">
          About
        </h4>
        <p className="ml-3 font-segoe font-thin tracking-wide">
          {user.bio || "No bio available"}
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full bg-bg_card3 p-5 mt-3">
        <div className="flex flex-row items-center justify-between">
          <h4 className="font-segoe text-font_dark font-thin tracking-wide font-lg ml-3">
            Media, links and docs
          </h4>
          <div className="flex flex-row gap-2">
            <span className="font-segoe text-font_dark font-thin">32</span>
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
        <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full">
          <Ban className="text-error ml-4" />
          <span className="font-segoe font-thin text-error tracking-wide">Block {user.username}</span>
        </div>
        <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full">
          <ThumbsDown className="text-error ml-4" />
          <span className="font-segoe font-thin text-error tracking-wide">Report {user.username}</span>
        </div>
        <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full">
          <Trash2 className="text-error ml-4" />
          <span className="font-segoe font-thin text-error tracking-wide">Delete Chat</span>
        </div>
      </div>
    </aside>
  );
};

export default Profile;
