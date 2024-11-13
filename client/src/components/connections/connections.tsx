// Connections.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setNavigation } from "@/context/reducers/navigation";
import SingleConnection from "./singleConnection";
import { useGetConnectionRequests, useGetConnections } from "@/hooks/user";
import { RootState } from "@/context/store";
import ConnectionProfile from "./connectionProfile";
import { IConnection } from "@/types/types";

const Connections = () => {
  
  const connectionRequests = useSelector((state: RootState) => state.connection.connectionRequests);
  const followers = useSelector((state: RootState) => state.connection.followers);
  const following = useSelector((state: RootState) => state.connection.following);
  const [isSidebar, setIsSidebar] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IConnection | null>(null); 
  const { getConnections } = useGetConnections();
  const { getConnectionRequests } = useGetConnectionRequests();
  const dispatch = useDispatch();

  const handleSidebarClose = () => {
    setIsSidebar(false);
    setSelectedUser(null); 
  };

  useEffect(() => {
    getConnections();
    getConnectionRequests();
  }, []);

  return (
    <section className={`flex flex-col w-full gap-6 h-full ${isSidebar ? 'p-0' : 'p-4'}`}>
      {isSidebar ? (
        <div className="flex flex-col h-full w-full bg-bg_dark1 overflow-y-scroll">
          {selectedUser && <ConnectionProfile user={selectedUser} onClose={handleSidebarClose} />}
        </div>
      ) : (
        <>
          {/* Header with title and icons */}
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-sfpro text-font_main text-xl font-bold antialiased">
              Connections
            </h2>
            <div className="flex flex-row gap-6 items-center">
              <div className="relative">
                <Image
                  src="/noti.svg"
                  width={25}
                  height={25}
                  alt="Notifications"
                  onClick={() => dispatch(setNavigation("connection-requests"))}
                />
                {/* Notification dot */}
                {connectionRequests.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
                )}
              </div>
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

          <div className="p-2 flex flex-row gap-3">
            <span
              className={`text-font_main border border-primary hover:bg-primary hober:bg-opacity-75 px-4 py-2 rounded-3xl cursor-pointer ${isFollowing ? undefined : 'bg-primary bg-opacity-50'}`}
              onClick={() => setIsFollowing(false)}
            >
              followers
            </span>
            <span
              className={`text-font_main border border-primary hover:bg-primary hober:bg-opacity-75 px-4 py-2 rounded-3xl cursor-pointer ${isFollowing ? 'bg-primary bg-opacity-50' : undefined}`}
              onClick={() => setIsFollowing(true)}
            >
              following
            </span>
          </div>

          {/* Chat List */}
          <div className="flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin pr-2 space-y-2">
            {isFollowing ? (
              following.map((user) => (
                <SingleConnection
                  key={user.userId}
                  user={user}
                  setIsSidebar={setIsSidebar}
                  setSelectedUser={setSelectedUser} 
                />
              ))
            ) : (
              followers.map((user) => (
                <SingleConnection
                  key={user.userId}
                  user={user}
                  setIsSidebar={setIsSidebar}
                  setSelectedUser={setSelectedUser} 
                />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Connections;
