"use client";

import React, { useEffect } from "react";
import Navigation from "@/components/navigation/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store";
import Profile from "@/components/settings/profile";
import Settings from "@/components/settings/settings";
import NewChat from "@/components/add-connections/newChat";
import { motion } from "framer-motion";
import Connections from "@/components/connections/connections";
import ConnectionRequest from "@/components/connections/connectionRequest";
import ChatSection from "@/components/chat/chatSection";
import Chat from "@/components/chat/chat";
import { useGetMe } from "@/utils/api";

const Main = () => {
  const navigation = useSelector((state: RootState) => state.navigation.title);
  const { getMe }  = useGetMe();

  useEffect(() => {
    getMe();
  }, []);
  
  return (
    <motion.main
      variants={{
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 1, delay: 0.25 }}
      viewport={{ once: true }}
      className="bg-bg_main h-screen w-full flex justify-center items-center"
    >
      {/* Container */}
      <div className="w-[98%] h-[95vh] flex rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 h-full bg-bg_dark1 flex flex-row border-r-2 border-r-bg_card2">
          <Navigation />
          {navigation === "chat" && <Chat />}
          {navigation === "profile" && <Profile />}
          {navigation === "settings" && <Settings />}
          {navigation === "newchat" && <NewChat />}
          {navigation === "connections" && <Connections />}
          {navigation === "connection-requests" && <ConnectionRequest />}
        </div>
        {/* Chat area */}
        <div className="w-2/3 h-full bg-bg_card1">
          <ChatSection />
        </div>
      </div>
    </motion.main>
  );
};

export default Main;
