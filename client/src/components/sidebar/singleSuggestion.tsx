import React from "react";
import Image from "next/image";
import { IUser } from "@/types/types";
import { useSendConnectionRequest } from "@/utils/api";

const SingleSuggestion = ({ user }: { user: IUser }) => {
  const { sendConnectionRequest } = useSendConnectionRequest();

  const renderButton = () => {
    if (!user.isFollowing && !user.isRequested) {
      return (
        <button
          title="Connect"
          type="button"
          className="text-font_main flex items-center justify-center rounded-md bg-primary px-3 py-1 text-base outline-none transition-all duration-300"
          onClick={() => sendConnectionRequest(user.userId)}
        >
          Connect
        </button>
      );
    } else if (user.isFollowing) {
      return (
        <button
          title="Chat"
          type="button"
          className="text-font_main flex items-center justify-center rounded-md bg-primary px-3 py-1 text-base outline-none transition-all duration-300"
          onClick={() => {/* Logic to initiate chat */}}
        >
          Chat
        </button>
      );
    } else if (user.isRequested) {
      return (
        <button
          title="Sent"
          type="button"
          className="text-font_main flex items-center justify-center rounded-md bg-transparent border border-primary px-3 py-1 text-base outline-none transition-all duration-300 cursor-not-allowed"
          disabled
        >
          Sent
        </button>
      );
    }
  };

  return (
    <div className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative">
      <Image
        src={user.avatarUrl || '/pfp.jpg'}
        width={50}
        height={50}
        alt="Profile"
        className="rounded-full"
      />
      <div className="ml-4 flex flex-col flex-grow justify-between">
        <h4 className="font-light tracking-wide text-font_main">{user.username}</h4>
        <p className="text-sm text-gray-600 truncate">
          {user.bio}
        </p>
      </div>
      {renderButton()}
      <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
    </div>
  );
};

export default SingleSuggestion;
