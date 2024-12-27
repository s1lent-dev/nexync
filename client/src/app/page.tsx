"use client";

import React, { useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { useGetMe } from "@/hooks/user";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Loader from "@/components/common/loader";
const Navigation = dynamic(() => import("@/components/navigation/navigation"), { ssr: false });
const Profile = dynamic(() => import("@/components/settings/profile"), { ssr: false });
const Settings = dynamic(() => import("@/components/settings/settings"), { ssr: false });
const NewChat = dynamic(() => import("@/components/add-connections/newChat"), { ssr: false });
const Connections = dynamic(() => import("@/components/connections/connections"), { ssr: false });
const ConnectionRequest = dynamic(() => import("@/components/connections/connectionRequest"), { ssr: false });
const ChatSection = dynamic(() => import("@/components/chat/chatSection"), { ssr: false, loading: () => <Loader /> });
const Chat = dynamic(() => import("@/components/chat/chat"), { ssr: false, loading: () => <Loader /> });
const GroupChat = dynamic(() => import("@/components/group/groupChat"),{ ssr: false, loading: () => <Loader /> });
const GroupChatSection = dynamic(() => import("@/components/group/groupChatSection"), { ssr: false, loading: () => <Loader /> });
const NewGroup = dynamic(() => import("@/components/add-connections/newGroup"), {ssr: false});


const Main = () => {
  const navigation = useSelector((state: RootState) => state.navigation.title);
  const { getMe } = useGetMe();

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
          <Suspense fallback={<Loader />}>
            <Navigation />
          </Suspense>
          <Suspense fallback={<Loader />}>
            {navigation === "chats" && <Chat />}
            {navigation === "groups" && <GroupChat />}
            {navigation === "profile" && <Profile />}
            {navigation === "settings" && <Settings />}
            {navigation === "newchat" && <NewChat />}
            {navigation === "newgroup" && <NewGroup />}
            {navigation === "connections" && <Connections />}
            {navigation === "connection-requests" && <ConnectionRequest />}
          </Suspense>
        </div>
        {/* Chat area */}
        <div className="w-2/3 h-full bg-bg_card1">
          <Suspense fallback={<Loader />}>
            {navigation === "chats" && <ChatSection />}
            {navigation === "groups" && <GroupChatSection />}
          </Suspense>
        </div>
      </div>
    </motion.main>
  );
};

export default Main;
