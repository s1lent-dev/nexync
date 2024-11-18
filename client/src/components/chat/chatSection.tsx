import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Profile from './profile';
import { SendHorizontal, CheckCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/context/store';
import { useGetInfiniteScrollMessages, useReadMessage, useSendMessage, useSocketMessages, useTypingMessage } from '@/hooks/chat';
import { ChatType, IMessage, ITyping, MessageType } from '@/types/types';
import ChatBubble from '../common/chat-bubble';
import { setUnread } from '@/context/reducers/chats';

const ChatSection = () => {

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const user = useSelector((state: RootState) => {
    const selectedUserId = state.chat.selectedConnectionChat.userId;
    return state.chat.connectionChats.find(chat => chat.userId === selectedUserId) || state.chat.selectedConnectionChat;
  });
  const me = useSelector((state: RootState) => state.user.me);
  const userMessages = useSelector((state: RootState) => state.chat.chats[user.chatId]);
  const typing = useSelector((state: RootState) => state.chat.chatTypings[user.chatId]);
  const { sendMessage } = useSendMessage();
  const { readMessage } = useReadMessage();
  const { typingMessage } = useTypingMessage();
  useSocketMessages();
  // const { getMessages } = useGetMessages();
  const { getInfiniteScrollMessages } = useGetInfiniteScrollMessages();
  const dispatch = useDispatch();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    if (user && chatContainerRef.current) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);  
    }
  }, [user]);


  const loadMoreMessages = async () => {
    if (!user.chatId || !userMessages?.length) return;
    const lastMessageId = userMessages[0].messageId; 
    await getInfiniteScrollMessages(user.chatId, lastMessageId);
  };

  useEffect(() => {
    if (user.chatId) {
      const fetchInitialMessages = async () => {
        await getInfiniteScrollMessages(user.chatId);
      };
      fetchInitialMessages();
    }
  }, [user.chatId]);

  useEffect(() => {
    const chatContainer = document.querySelector("#chat-container");

    const handleScroll = async () => {
      if (chatContainer?.scrollTop === 0) {
        await loadMoreMessages();
      }
    };

    chatContainer?.addEventListener("scroll", handleScroll);
    return () => chatContainer?.removeEventListener("scroll", handleScroll);
  }, [userMessages, user.chatId]);

  useEffect(() => {
    if (user.chatId && userMessages?.length > 0) {
      const initMessages = async () => {
        const unreadMessages = userMessages.filter(
          (message) => message.senderId !== me.userId && message.status !== "READ"
        );
        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map((message) => message.messageId);
          await readMessage({
            chatId: user.chatId,
            senderId: user.userId,
            messageIds,
            readBy: me.userId,
            chatType: ChatType.PRIVATE,
          });
          dispatch(setUnread([{ chatId: user.chatId, count: 0 }]));
        }
      };
      initMessages();
    }
  }, [user.chatId, userMessages, dispatch, me.userId, readMessage, user.userId]);



  const handleSendMessage = async () => {
    if (!inputValue) return;
    if (!user.userId) return;
    const message: IMessage = {
      messageId: '',
      username: me.username,
      chatType: ChatType.PRIVATE,
      messageType: MessageType.TEXT,
      senderId: me.userId,
      chatId: user.chatId,
      memberIds: [me.userId, user.userId],
      content: inputValue,
      status: "SENT",
      createdAt: new Date(),
    };
    await sendMessage(message);
    setInputValue("");
  };

  const handleTyping = async () => {
    console.log("Typing");
    const typing: ITyping = {
      senderId: me.userId,
      username: me.username,
      chatId: user.chatId,
      memberIds: [me.userId, user.userId],
    }
    await typingMessage(typing);
  }

  if (!user.userId) {
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
                src={user.avatarUrl || "/pfp.jpg"}
                width={40}
                height={40}
                alt="desc"
                className="object-cover w-fit h-fit rounded-full cursor-pointer"
              />
            </div>
            <div>
              <h3 className="font-semibold text-font_main">{user.username}</h3>
              <p className={`text-sm ${user.status === 'online' ? 'text-primary' : 'text-font_dark'}`}>{user.status}</p>
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
        <article 
        id='chat-container'
        ref={chatContainerRef}
        className="chat-container flex-grow overflow-y-scroll p-4 bg-bg_dark2 custom-scrollbar space-y-4">
          {userMessages && userMessages.length === 0 ? (
            <p className="text-center text-gray-400">No messages yet</p>
          ) : (
            userMessages && userMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === me.userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative px-3 py-1 rounded-lg max-w-xs break-words ${message.senderId === me.userId
                    ? 'bg-chat text-font_main rounded-tr-none before:content-[""] before:absolute before:right-[-6px] before:top-0 before:w-0 before:h-0 before:border-t-[0px] before:border-t-transparent before:border-b-[6px] before:border-b-transparent before:border-l-[8px] before:border-l-chat pr-8'
                    : 'bg-bg_card2 text-font_main rounded-tl-none before:content-[""] before:absolute before:left-[-6px] before:top-0 before:w-0 before:h-0 before:border-t-[0px] before:border-t-transparent before:border-b-[6px] before:border-b-transparent before:border-r-[8px] before:border-r-bg_card2'
                    }`}
                >
                  {message.content}
                  {message.senderId === me.userId && (
                    <CheckCheck
                      size={18}
                      className={`absolute bottom-1 right-1 ${message.status === 'READ' ? 'text-blue-500' : 'text-font_dark'
                        }`}
                    />
                  )}
                </div>

              </div>
            ))
          )}
          {typing && typing.chatId === user.chatId && typing.senderId !== me.userId && (
            <ChatBubble username="" />
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
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping();
            }}
          />
          <button
            type='button'
            title='Send Message'
            onClick={handleSendMessage}
          >
            <SendHorizontal size={25} className="cursor-pointer text-primary" />
          </button>
        </footer>
      </div >

      {/* Profile Sidebar */}
      {
        isSidebarOpen && (
          <div className="flex flex-col h-full w-1/2 bg-bg_dark1 ">
            <Profile onClose={handleSidebarClose} user={user} />
          </div>
        )
      }
    </section >
  );
};

export default ChatSection;
