"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setNavigation } from "@/context/reducers/navigation.reducer";
import { RootState } from "@/context/store";

const Navigation = () => {
  const me = useSelector((state: RootState) => state.user.me);
  const navigation = useSelector((state: RootState) => state.navigation.title);
  const dispatch = useDispatch();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: "chats", src: "/chat.svg", label: "Chats" },
    { name: "newchat", src: "/status.svg", label: "Newchat" },
    { name: "groups", src: "/channel.svg", label: "Groups" },
    { name: "connections", src: "/community.svg", label: "Connections" },
    { name: "meta", src: "/meta.png", size: 25, label: "Meta" },
  ];

  return (
    <aside className="bg-bg_card1 h-full flex flex-col items-center justify-between p-4 shadow-sm shadow-font_light relative">
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`p-2 rounded-full relative ${
              navigation === item.name ? "bg-white bg-opacity-10" : ""
            }`}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Image
              src={item.src}
              width={item.size || 25}
              height={item.size || 25}
              alt={item.name}
              className="cursor-pointer"
              onClick={() => dispatch(setNavigation(item.name))}
            />
            {hoveredItem === item.name && (
              <span className="absolute z-50 left-12 top-1/2 transform -translate-y-1/2 bg-font_main text-bg_dark2 px-2 py-1 rounded-xl text-sm shadow-lg">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div
          className={`p-2 rounded-full relative ${
            navigation === "settings" ? "bg-white bg-opacity-10" : ""
          }`}
          onMouseEnter={() => setHoveredItem("settings")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Image
            src="/settings.svg"
            width={30}
            height={30}
            alt="Settings"
            className="cursor-pointer"
            onClick={() => dispatch(setNavigation("settings"))}
          />
          {hoveredItem === "settings" && (
            <span className="absolute z-50 left-12 top-1/2 transform -translate-y-1/2 bg-font_main text-bg_dark2 px-2 py-1 rounded-xl text-sm shadow-lg">
              Settings
            </span>
          )}
        </div>

        <div
          className={`p-2 rounded-full relative ${
            navigation === "profile" ? "bg-white bg-opacity-10" : ""
          }`}
          onMouseEnter={() => setHoveredItem("profile")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="max-w-[40px] max-h-[40px] rounded-full overflow-hidden cursor-pointer">
            <Image
              src={me.avatarUrl || "/pfp.jpg"}
              width={40}
              height={40}
              alt="Profile Picture"
              objectFit="cover"
              onClick={() => dispatch(setNavigation("profile"))}
            />
          </div>
          {hoveredItem === "profile" && (
            <span className="absolute z-50 left-12 top-1/2 transform -translate-y-1/2 bg-font_main text-bg_dark2 px-2 py-1 rounded-xl text-sm shadow-lg">
              Profile
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
