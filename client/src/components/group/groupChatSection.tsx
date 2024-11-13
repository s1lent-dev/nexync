import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import GroupProfile from './groupProfile';
import { SendHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/context/store';
import { useGetMessages, useSendMessage, useSocketMessages } from '@/hooks/chat';
import { IMessage } from '@/types/types';

const GroupChatSection = () => {

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const group = useSelector((state: RootState) => state.chat.selectedGroupChat);
  const me = useSelector((state: RootState) => state.user.me);
  const groupMessages = useSelector((state: RootState) => state.chat.chats[group.chatId]);
  const { sendMessage } = useSendMessage();
  useSocketMessages();
  const { getMessages } = useGetMessages();
  
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (group.chatId) {
      getMessages(group.chatId);
    }
  }, [group.chatId]);

  const handleSendMessage = async () => {
    if (!inputValue) return;
    if (!group.chatId) return;
    const message: IMessage = {
      senderId: me.userId,
      chatId: group.chatId,
      memberIds: group.members.map((member) => member.userId),
      content: inputValue,
      createdAt: new Date(),
    };
    await sendMessage(message);
    setInputValue("");
  };

  if (!group.chatId) {
    return (
      <section className="flex flex-col items-center justify-center h-full w-full bg-bg_card2">
        <Image src='/illustration.webp' width={300} height={300} alt='select-user' />
        <h1 className='font-geist text-font_main text-3xl'>Welcome To Nexync !</h1>
        <p className="font-segoe font-thin text-font_dark text-sm text-center max-w-sm mx-auto leading-4 mt-6 tracking-wide">
          Where connections spark, and conversations flow. Scalable, seamless, and always in sync !
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full w-full">
      {/* Main Chat Section */}
      <div className={`flex flex-col h-full ${isSidebarOpen ? 'w-1/2' : 'w-full'} transition-width duration-300`}>
        {/* Navbar */}
        <nav className="flex justify-between items-center px-4 py-2 bg-bg_card1">
          {/* User Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSidebarOpen(true)}>
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                <Image
                    src={group.avatarUrl || "/pfp.jpg"}
                    width={40}
                    height={40}
                    alt="desc"
                    className="object-cover w-fit h-fit rounded-full cursor-pointer"
                />
            </div>
            <div>
              <h3 className="font-semibold text-font_main">{group.name}</h3>
              <p className="text-sm text-primary">
                {group.members.length} members
              </p>
            </div>
          </div>
          {/* Icons */}
          <div className="flex gap-6">
            <Image src='/delete.svg' width={27.5} height={27.5} alt='delete' className="cursor-pointer" />
            <Image src='/search.svg' width={27.5} height={27.5} alt='search' className="cursor-pointer" />
            <Image src='/menu.svg' width={27.5} height={27.5} alt='menu' className="cursor-pointer" />
          </div>
        </nav>

        {/* Messages Section */}
        <article className="flex-grow overflow-y-scroll p-4 bg-bg_dark2 custom-scrollbar space-y-4">
          {(groupMessages && groupMessages.length === 0) ? (
            <p className="text-center text-gray-400">No messages yet</p>
          ) : (
            groupMessages && groupMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === me.userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    message.senderId === me.userId ? 'bg-chat text-font_main' : 'bg-bg_card2 text-font_main'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </article>

        {/* Footer */}
        <footer className="flex items-center gap-3 p-3 bg-bg_card1">
          <Image src='/emojis.svg' width={25} height={25} alt='emojis' className="cursor-pointer" />
          <Image src='/attach.svg' width={30} height={30} alt='attach' className="cursor-pointer" />
          <input
            type='text'
            placeholder='Type a message'
            className="flex-grow placeholder:text-slate-400 px-4 py-2 rounded-lg bg-slate-600 bg-opacity-30 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type='button'
            title='Send Message'
            onClick={handleSendMessage}
          >
            <SendHorizontal size={25} className="cursor-pointer text-primary" />
          </button>
        </footer>
      </div>

      {/* Profile Sidebar */}
      {isSidebarOpen && (
        <div className="flex flex-col h-full w-1/2 bg-bg_dark1 ">
          <GroupProfile onClose={handleSidebarClose} group={group} />
        </div>
      )}
    </section>
  );
};

export default GroupChatSection;