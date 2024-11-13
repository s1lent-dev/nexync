import React from "react";
import Image from "next/image";
import { CircleCheck, CircleX } from "lucide-react";
import { IConnectionRequests } from "@/types/types";
import { useAcceptConnectionRequest } from "@/hooks/user";
import { useToast } from "@/context/toast/toast";

interface SingleRequestProps {
  user: IConnectionRequests;
  handleRequestAction: () => void;
}

const SingleRequest: React.FC<SingleRequestProps> = ({ user, handleRequestAction }) => {

  const { acceptConnectionRequest } = useAcceptConnectionRequest();
  const { showSuccessToast, showErrorToast } = useToast();
  const handleRequest = async (status: string) => {
    await acceptConnectionRequest(user.userId, status);
    handleRequestAction();
  }

  return (
    <div className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative">
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
        <Image
          src={user.avatarUrl || "/pfp.jpg"}
          width={80}
          height={80}
          alt="desc"
          className="object-cover w-fit h-fit rounded-full"
        />
      </div>
      <div className="ml-4 flex flex-col flex-grow justify-between">
        <h4 className="font-light tracking-wide text-font_main">{user.username}</h4>
        <p className="text-sm text-gray-600 truncate">10 days ago</p>
      </div>
      <div className="flex flex-row gap-2">
        <CircleX
          size={40}
          strokeWidth={1}
          className="text-red-600 hover:fill-red-500 hover:opacity-75 rounded-full"
          onClick={async () => {
            await handleRequest("rejected");
            showErrorToast("Connection request rejected");
          }}
        />
        <CircleCheck
          size={40}
          strokeWidth={1}
          className="text-green-600 hover:fill-green-500 hover:opacity-75 rounded-full"
          onClick={async () => {
            await handleRequest("accepted");
            showSuccessToast("Connection request accepted");
          }}
        />
      </div>
      <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
    </div>
  );
};

export default SingleRequest;
