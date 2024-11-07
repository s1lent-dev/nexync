"use client"

import React, { useEffect } from "react";
import Image from "next/image";
import SingleChat from "./singleChat"; // Import the SingleChat component
import { useDispatch, useSelector } from "react-redux";
import { setNavigation } from "@/context/reducers/navigation";
import { useGetConnectedUsers } from "@/utils/api";
import { RootState } from "@/context/store";

const Chat = () => {
  
  const connections = useSelector((state: RootState) => state.User.connections);
  const dispatch = useDispatch();
  const { getConnectedUsers } = useGetConnectedUsers();

  useEffect(() => {
    getConnectedUsers();
  }, []);

  return (
    <section className="flex flex-col p-4 w-full gap-6 h-full">
      {/* Header with title and icons */}
      <div className="flex flex-row justify-between">
        <h2 className="font-sfpro text-font_main text-xl font-bold antialiased">
          Chats
        </h2>
        <div className="flex flex-row gap-6">
          <Image src="/new-chat.svg" width={25} height={25} alt="New Chat" onClick={() => dispatch(setNavigation("newchat"))}/>
          <Image src="/menu.svg" width={25} height={25} alt="Menu" />
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full bg-bg_card1 p-1 rounded-lg flex items-center">
        <Image src="/search.svg" width={25} height={25} alt="Search Icon" />
        <input
          type="text"
          placeholder="Search..."
          className="w-10/12 bg-transparent placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
        />
      </div>

      {/* Chat List with scrollable div */}
      <div className="flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin pr-2 space-y-2">
        {connections.length > 0 ? (
          connections.map((connection) => (
            <SingleChat key={connection.userId} connection={connection} />
          ))
        ) : (
          <p className="text-font_dark text-center">No chats found</p>
        )}
      </div>
    </section>
  );
};

export default Chat;
