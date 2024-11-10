"use client";
import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setNavigation } from "@/context/reducers/navigation";
import { RootState } from "@/context/store";

const Navigation = () => {
  const me = useSelector((state: RootState) => state.user.me);
  const navigation = useSelector((state: RootState) => state.navigation.title);
  const dispatch = useDispatch();

  const navItems = [
    { name: "chat", src: "/chat.svg" },
    { name: "status", src: "/status.svg"},
    { name: "channel", src: "/channel.svg" },
    { name: "connections", src: "/community.svg"},
    { name: "archive", src: "/archive.svg" },
    { name: "meta", src: "/meta.png", size: 20 }, 
  ];

  return (
    <aside className="bg-bg_card1 h-full flex flex-col items-center justify-between p-4 shadow-sm shadow-font_light">
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`p-2 rounded-full ${
              navigation === item.name ? "bg-white bg-opacity-10" : ""
            }`}
          >
            <Image
              src={item.src}
              width={item.size || 30}
              height={item.size || 30}
              alt={item.name}
              className="cursor-pointer"
              onClick={() => dispatch(setNavigation(item.name))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div
          className={`p-1 rounded-full ${
            navigation === "settings" ? "bg-white bg-opacity-10" : ""
          }`}
        >
          <Image
            src="/settings.svg"
            width={30}
            height={30}
            alt="Settings"
            className="cursor-pointer"
            onClick={() => dispatch(setNavigation("settings"))}
          />
        </div>

        <div
          className={`p-1 rounded-full ${
            navigation === "profile" ? "bg-white bg-opacity-10" : ""
          }`}
        >
          <div className="max-w-[25px] max-h-[25px] rounded-full overflow-hidden cursor-pointer">
            <Image
              src={me.avatarUrl || "/pfp.jpg"}
              width={25}
              height={25}
              alt="Profile Picture"
              objectFit="cover"
              onClick={() => dispatch(setNavigation("profile"))}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
