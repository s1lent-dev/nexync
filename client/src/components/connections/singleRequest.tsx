import React from "react";
import Image from "next/image";
import { CircleCheck, CircleX } from "lucide-react";
const SingleRequest = () => {

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
        <p className="text-sm text-gray-600 truncate">10days ago</p>
      </div>
      <div className="flex flex-row gap-2">
        <CircleX size={40} strokeWidth={1} className="text-red-600" />
        <CircleCheck
          size={40}
          strokeWidth={1}
          className="text-green-600"
        />
      </div>
      <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
    </div>
  );
};

export default SingleRequest;
