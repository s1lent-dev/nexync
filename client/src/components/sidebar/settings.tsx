import React from "react";
import Image from "next/image";

const SeetingsData = [
    {
        url: "/account.svg",
        title: "Account",
    },
    {
        url: "/lock.svg",
        title: "Privacy",
    },
    {
        url: "/chat.svg",
        title: "Chats",
    },
    {
        url: "/noti.svg",
        title: "Notifications",
    },
    {
        url: "/shortcuts.svg",
        title: "Keyboard Shortcuts",
    },
    {
        url: "/help.svg",
        title: "Help",
    },
    {
        url: "/logout.svg",
        title: "Logout",
    }
]

const Settings = () => {
  return (
    <section className="flex flex-col p-4 w-full gap-4 h-full">
      <h2 className="font-sfpro text-font_main text-xl font-bold antialiased">
        Settings
      </h2>
      <div className="w-full bg-bg_card1 p-1 rounded-lg flex items-center">
        <Image src="/search.svg" width={25} height={25} alt="Search Icon" />
        <input
          type="text"
          placeholder="Search..."
          className="w-10/12 bg-transparent placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
        />
      </div>
      <div className="w-full flex flex-row items-center justify-between p-2 gap-4 hover:bg-bg_card2 cursor-pointer">
        <Image
          src="/pfp.jpg"
          width={80}
          height={80}
          alt="desc"
          className="rounded-full"
        />
        <div className="flex flex-col w-full max-w-xs">
          <h4 className="text-lg font-semibold text-font_main">
            Paresh Deshpande
          </h4>
          <p className="text-sm text-font_dark overflow-hidden whitespace-nowrap text-ellipsis w-5/6">
            Sometimes your friends can let you down, but once in a while, they
            are the only reason that you are standing up!
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
            {SeetingsData.map((data, index) => (
                <div key={index} className={`flex flex-row items-center gap-6 p-4 relative ${data.title === "Logout" ? 'hover:bg-red-400 hover:bg-opacity-20': 'hover:bg-bg_card2' } cursor-pointer`}>
                    { data.title === "Logout" ? (
                        <>
                        <Image src={data.url
                        } width={25} height={25} alt="desc" />
                        <span className="font-segoe font-light text-base text-red-400">{data.title}</span>
                        </>
                    ) : (
                        <>
                        <Image src={data.url
                        } width={25} height={25} alt="desc" />
                        <span className="font-segoe font-light text-base text-font_main">{data.title}</span>
                        </>
                    ) }
                    
                    <span className="absolute bottom-0 left-12 right-0 h-[2px] bg-bg_card2" />
                </div>
            ))}
            
        </div>
    </section>
  );
};

export default Settings;
