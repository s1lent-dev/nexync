"use client";

import React, { useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { useGetMe } from "@/hooks/user";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Navigation = dynamic(() => import("@/components/navigation/navigation"), {
  suspense: true,
});
const Profile = dynamic(() => import("@/components/settings/profile"), {
  suspense: true,
});
const Settings = dynamic(() => import("@/components/settings/settings"), {
  suspense: true,
});
const NewChat = dynamic(() => import("@/components/add-connections/newChat"), {
  suspense: true,
});
const Connections = dynamic(() => import("@/components/connections/connections"), {
  suspense: true,
});
const ConnectionRequest = dynamic(() => import("@/components/connections/connectionRequest"), {
  suspense: true,
});
const ChatSection = dynamic(() => import("@/components/chat/chatSection"), {
  suspense: true,
});
const Chat = dynamic(() => import("@/components/chat/chat"), {
  suspense: true,
});
const GroupChat = dynamic(() => import("@/components/group/groupChat"), {
  suspense: true,
});
const GroupChatSection = dynamic(() => import("@/components/group/groupChatSection"), {
  suspense: true,
});
const NewGroup = dynamic(() => import("@/components/add-connections/newGroup"), {
  suspense: true,
});

const Loader = dynamic(() => import("@/components/common/loader"), {
  loading: () => <Loader />,
});

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
