import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import SingleSuggestion from "./singleSuggestion";
import { setNavigation } from "@/context/reducers/navigation";

const NewChat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  return (
    <section className="flex flex-col p-4 w-full gap-6 h-full flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin">
      <div className="flex flex-row gap-8">
        <ArrowLeft width={25} className="text-primary cursor-pointer" onClick={() => dispatch(setNavigation('chat'))}/>
        <h4 className="font-sfpro text-font_dark text-xl font-thin">
          New chat
        </h4>
      </div>
      <div className="w-full bg-bg_card1 p-1 rounded-lg flex items-center">
        <Image src="/search.svg" width={25} height={25} alt="Search Icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-10/12 bg-transparent placeholder:text-font_light placeholder:font-thin placeholder:font-segoe ml-2 focus:outline-none"
        />
      </div>

      {searchQuery ? (
        <div className="flex flex-col gap-4">
          <h2 className="font-segoe text-primary text-xl tracking-widest ml-6 font-thin opacity-75">
            Search Results
          </h2>
          <div className="pr-2 space-y-2">
            {[...Array(5)].map((_, index) => (
              <SingleSuggestion key={index} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-4 items-center hover:bg-bg_card2 p-2 cursor-pointer relative">
              <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-full">
                <Image src="/group.svg" width={25} height={25} alt="Group" />
              </div>
              <h4 className="font-segoe antialiased">New Group</h4>
              <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
            </div>
            <div className="flex flex-row gap-4 items-center hover:bg-bg_card2 p-2 cursor-pointer relative">
              <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-full">
                <Image src="/comm.svg" width={25} height={25} alt="Community" />
              </div>
              <h4 className="font-segoe antialiased">New Community</h4>
              <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-segoe text-primary text-xl tracking-widest ml-6 font-thin opacity-75">
              Suggestions
            </h2>
            <div className="pr-2 space-y-2">
              {[...Array(15)].map((_, index) => (
                <SingleSuggestion key={index} />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default NewChat;
