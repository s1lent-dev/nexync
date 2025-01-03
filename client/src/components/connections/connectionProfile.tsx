import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import {
  ChevronRight,
  Heart,
  Ban,
  ThumbsDown,
  Trash2,
  MessageCircleCode,
  Phone,
} from "lucide-react";
import { IConnection } from "@/types/types";
import { useCancelConnectionRequest, useGetConnections, useRemoveFollower, useRemoveFollowing } from "@/hooks/user";
import { useToast } from "@/context/toast/toast";

interface ProfileProps {
  onClose: () => void;
  user: IConnection;
}

const ConnectionProfile: React.FC<ProfileProps> = ({ onClose, user }) => {

  const { removeFollower } = useRemoveFollower();
  const { removeFollowing } = useRemoveFollowing();
  const { cancelConnectionRequest } = useCancelConnectionRequest();
  const { getConnections } = useGetConnections();
  const { showSuccessToast, showErrorToast } = useToast();

  const handleRemoveFollower = async () => {
    try {
      const res = await removeFollower(user.userId);
      if(res.statusCode === 200) {
        showSuccessToast(res.message);
        await getConnections();
        onClose();
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to remove follower");
    }
  }

  const handleRemoveFollowing = async () => {
    try {
      const res = await removeFollowing(user.userId);
      if(res.statusCode === 200) {
        showSuccessToast(res.message);
        await getConnections();
        onClose();
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to remove following");
    }
  }

  const handleCancelConnectionRequest = async () => {
    try {
      const res = await cancelConnectionRequest(user.userId);
      if(res.statusCode === 200) {
        showSuccessToast(res.message);
        await getConnections();
        onClose();
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to cancel connection request");
    }
  }

  const getActions = () => {
    const actions = [];
    if (user.isFollowing && user.isFollower && !user.isRequested) {
      actions.push({
        label: "Unfollow",
        icon: <Trash2 className="text-error ml-4" />,
        onClick: handleRemoveFollowing,
      });
      actions.push({
        label: "Remove Follower",
        icon: <Trash2 className="text-error ml-4" />,
        onClick: handleRemoveFollower,
      });
    } else if (user.isFollowing && !user.isFollower && !user.isRequested) {
      actions.push({
        label: "Unfollow",
        icon: <Trash2 className="text-error ml-4" />,
        onClick: handleRemoveFollowing,
      });
    } else if (user.isFollower && !user.isFollowing && user.isRequested) {
      actions.push({
        label: "Remove Follower",
        icon: <Trash2 className="text-error ml-4" />,
        onClick: handleRemoveFollower,
      });
      actions.push({
        label: "Unsend Request",
        icon: <Trash2 className="text-error ml-4" />,
        onClick: handleCancelConnectionRequest,
      });
    } else if (user.isFollower && !user.isFollowing && !user.isRequested) {
      actions.push({
        label: "Remove Follower",
        icon: <Trash2 className="text-error ml-4" />,
        onClick: handleRemoveFollower,
      });
    }
    return actions;
  };

  const actions = getActions();

  return (
    <aside className="flex flex-col h-full w-full bg-bg_dark1 shadow-lg overflow-y-scroll custom-scrollbar relative">
      {/* Sticky Navbar */}
      <nav className="flex items-center w-full gap-5 p-5 bg-bg_card3 shadow sticky z-10">
        <X className="text-font_dark cursor-pointer" onClick={onClose} />
        <h4 className="text-base tracking-wide text-font_main">Friend Info</h4>
      </nav>

      {/* Profile content */}
      <div className="flex flex-col w-full items-center justify-center bg-bg_card3 p-5">
        <div className="flex items-center justify-center">
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
            <Image
              src={user.avatarUrl || "/pfp.jpg"}
              width={200}
              height={200}
              alt="Profile picture"
              className="object-cover w-fit h-fit rounded-full"
            />
          </div>
        </div>
        <h2 className="mt-6 font-thin tracking-wider font-sfpro text-font_main text-xl antialiased">
          {user.username}
        </h2>
        <span className="mt-1 font-thin font-segoe text-font_dark opacity-75 text-base antialiased">
          {user.email}
        </span>
        <div className="flex flex-row gap-4 mt-6">
          <button className="flex flex-row gap-4 px-4 py-2 bg-primary border border-primary rounded-md">
            <MessageCircleCode width={25} strokeWidth={1} className="text-font_main" />
            <span className="text-font_main">Message</span>
          </button>
          <button className="flex flex-row gap-4 px-4 py-2 bg-primary border border-primary rounded-md">
            <Phone width={25} strokeWidth={1} className="text-font_main" />
            <span className="text-font_main">Call</span>
          </button>
        </div>
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
            Posts
          </h4>
          <div className="flex flex-row gap-2">
            <span className="font-segoe text-font_dark font-thin">34</span>
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

      {/* Actions */}
      <div className="flex flex-col w-full bg-bg_card3 mt-3 mb-3">
        <div className="flex flex-row gap-6 p-4 hover:bg-bg_card2 w-full">
          <Heart className="text-font_dark ml-4" />
          <span className="font-segoe font-thin text-font_main tracking-wide">Add to favourites</span>
        </div>
        <div className="flex flex-row gap-6 p-4 hover:bg-red-400 hover:bg-opacity-20 w-full">
          <Ban className="text-error ml-4" />
          <span className="font-segoe font-thin text-error tracking-wide">Block {user.username}</span>
        </div>
        <div className="flex flex-row gap-6 p-4 hover:bg-red-400 hover:bg-opacity-20 w-full">
          <ThumbsDown className="text-error ml-4" />
          <span className="font-segoe font-thin text-error tracking-wide">Report {user.username}</span>
        </div>
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex flex-row gap-6 p-4 hover:bg-red-400 hover:bg-opacity-20 w-full cursor-pointer"
            onClick={action.onClick}
          >
            {action.icon}
            <span className="font-segoe font-thin text-error tracking-wide">
              {action.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ConnectionProfile;

