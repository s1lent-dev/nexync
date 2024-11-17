import React from "react";
import Image from "next/image";
import { IConnection } from "@/types/types";
import { useCancelConnectionRequest, useSendConnectionRequest } from "@/hooks/user";
import { useToast } from "@/context/toast/toast";
import { UserPlus, MessageCircleCode, CircleDotDashed } from "lucide-react";

interface SingleSuggestionProps {
  user: IConnection;
  handleConnectionSent: () => void;
}

const SingleSuggestion: React.FC<SingleSuggestionProps> = ({ user, handleConnectionSent }) => {
  const { showSuccessToast } = useToast();
  const { sendConnectionRequest } = useSendConnectionRequest();
  const { cancelConnectionRequest } = useCancelConnectionRequest();

  const renderActionIcon = () => {

    const handleConnectClick = async () => {
      const requestSent = await sendConnectionRequest(user.userId);
      if (requestSent) {
        showSuccessToast("Connection request sent");
        handleConnectionSent();
      }
    };

    const handleCancelClick = async () => {
      const requestCancelled = await cancelConnectionRequest(user.userId);
      if (requestCancelled) {
        showSuccessToast("Connection request cancelled");
        handleConnectionSent();
      }
    }

    if (!user.isFollowing && !user.isRequested && !user.isFollower) {
      // Follow
      return (
        <div
          className="group flex items-center justify-center"
          onClick={handleConnectClick}
        >
          <UserPlus className="text-primary cursor-pointer transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute z-50 -left-4 border border-chat bottom-full mb-2 hidden w-max bg-bg_dark2 text-font_main px-2 py-1 rounded-xl text-sm shadow-lg group-hover:block">
            Follow
          </span>
        </div>
      );
    } else if (!user.isFollowing && !user.isRequested && user.isFollower) {
      // Follow Back
      return (
        <div
          className="group flex items-center justify-center"
          onClick={handleConnectClick}
        >
          <UserPlus className="text-primary cursor-pointer transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute z-50 -left-9 border border-chat bottom-full mb-2 hidden w-max bg-bg_dark2 text-font_main px-2 py-1 rounded-xl text-sm shadow-lg group-hover:block">
            Follow Back
          </span>
        </div>
      );
    } else if (user.isFollowing && user.isFollower) {
      // Chat
      return (
        <div
          className="group flex items-center justify-center"
          onClick={() => {
            /* Logic to initiate chat */
          }}
        >
          <MessageCircleCode className="text-primary cursor-pointer transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute z-50 -left-2 border border-chat bottom-full mb-2 hidden w-max bg-bg_dark2 text-font_main px-2 py-1 rounded-xl text-sm shadow-lg group-hover:block">
            Chat
          </span>
        </div>
      );
    } else if (user.isRequested) {
      // Sent
      return (
        <div
          onClick={handleCancelClick}
          className="group flex items-center justify-center"
        >
          <CircleDotDashed className="text-error transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute z-50 -left-14 border border-chat bottom-full mb-2 hidden w-max bg-bg_dark2 text-font_main px-2 py-1 rounded-xl text-sm shadow-lg group-hover:block">
            cancel request
          </span>
        </div>
      );
    } else if (user.isFollowing && !user.isFollower) {
      // Following
      return (
        <div
          className="group flex items-center justify-center"
          onClick={() => {
            /* Optional logic to unfollow if desired */
          }}
        >
          <UserPlus className="text-primary cursor-pointer transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute z-50 -left-6 border border-chat bottom-full mb-2 hidden w-max bg-bg_dark2 text-font_main px-2 py-1 rounded-xl text-sm shadow-lg group-hover:block">
            Following
          </span>
        </div>
      );
    }
  };

  return (
    <div className="relative flex items-center p-3 hover:bg-bg_card2 cursor-pointer">
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
        <Image
          src={user.avatarUrl || "/pfp.jpg"}
          width={50}
          height={50}
          alt="desc"
          className="object-cover w-fit h-fit rounded-full"
        />
      </div>
      <div className="ml-4 flex flex-col flex-grow justify-between">
        <h4 className="font-light tracking-wide text-font_main">{user.username}</h4>
        <p className="text-sm text-gray-600 truncate">{user.bio}</p>
      </div>
      <div className="relative flex items-center justify-center">{renderActionIcon()}</div>
      <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
    </div>
  );
};

export default SingleSuggestion;
