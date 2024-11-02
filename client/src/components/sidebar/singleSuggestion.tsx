import React from "react";
import Image from "next/image";
const SingleSuggestion = () => {
  return (
    <div className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative">
      <Image
        src="/pfp.jpg"
        width={50}
        height={50}
        alt="desc"
        className="rounded-full"
      />
      <div className="ml-4 flex flex-col flex-grow justify-between">
        <h4 className="font-light tracking-wide text-font_main">Username</h4>
        <p className="text-sm text-gray-600 truncate">
          Last message in the chat goes here...
        </p>
      </div>
      <button
        title="Sign in with Github"
        type="button"
        className="text-font_main flex items-center justify-center rounded-md bg-primary px-3 py-1 text-base outline-none transition-all duration-300"
      >
        chat
      </button>
      <span className="absolute bottom-0 left-14 right-0 h-[2px] bg-bg_card2" />
    </div>
  );
};

export default SingleSuggestion;
