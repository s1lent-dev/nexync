"use client";
import { Socket } from "socket.io-client";
import { createContext, useContext } from "react";
import dynamic from "next/dynamic";

const SocketProviderClient = dynamic(() => import('./socketProviderClient'), { ssr: false });

const SocketContext = createContext<Socket | null>(null);

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    return <SocketProviderClient>{children}</SocketProviderClient>;
};

export { SocketProvider, useSocket };
