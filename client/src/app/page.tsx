import React from 'react';
import Navigation from '@/components/navigation/navigation';
import Sidebar from '@/components/sidebar/sidebar';
import Chat from '@/components/chat/chat';

const Main = () => {
  return (
    <main className="bg-bg_main h-screen w-full flex justify-center items-center">
      {/* Container */}
      <div className="w-[98%] h-[95vh] flex rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 h-full bg-bg_dark1 flex flex-row border-r-2 border-r-bg_card2">
          <Navigation />
          <Sidebar />
        </div>
        {/* Chat area */}
        <div className="w-2/3 h-full bg-bg_card1">
          <Chat />
        </div>
      </div>
    </main>
  );
};

export default Main;
