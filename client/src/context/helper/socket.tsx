"use client";

import { useContext } from "react";
import dynamic from "next/dynamic";
import { Socket } from "socket.io-client";
import { SocketContext } from "./socketProviderClient";


const SocketProviderClient = dynamic(() => import('./socketProviderClient'), { ssr: false });
const useSocket = (): Socket | null => {
    return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    return <SocketProviderClient>{children}</SocketProviderClient>;
};

export { SocketProvider, useSocket };
