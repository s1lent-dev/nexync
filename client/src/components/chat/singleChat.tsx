"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { IConnectionChat } from '@/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedConnectionChat } from '@/context/reducers/chats';
import { RootState } from '@/context/store';

interface SingleChatProps {
  connection: IConnectionChat;
}

const SingleChat: React.FC<SingleChatProps> = ({ connection }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const unreadCount = useSelector(
    (state: RootState) => state.chat.unread[connection.chatId] || 0
  );

  return (
    <div
      className="flex items-center p-3 hover:bg-bg_card2 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => dispatch(setSelectedConnectionChat(connection))}
    >
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
        <Image
          src={connection.avatarUrl || "/pfp.jpg"}
          width={80}
          height={80}
          alt="desc"
          className="object-cover w-fit h-fit rounded-full"
        />
      </div>
      <div className="ml-4 flex flex-col flex-grow justify-between">
        <div className="flex justify-between">
          <h4 className="font-light tracking-wide text-font_main">{connection.username}</h4>
          <span className="text-xs text-gray-500">10:30 AM</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">Last message in the chat goes here...</p>
          {isHovered && <ChevronDown size={20} className="text-gray-400" />}
        </div>
      </div>

      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 text-xs font-semibold text-font_main bg-primary px-2 py-1 rounded-full">
          {unreadCount}
        </span>
      )}

      <span className="absolute bottom-0 left-12 right-0 h-[2px] bg-bg_card2" />
    </div>
  );
};

export default SingleChat;
