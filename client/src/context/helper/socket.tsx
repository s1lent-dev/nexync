"use client";
import { io, Socket } from "socket.io-client";
import { createContext, useContext, useMemo } from "react";
import Cookies from "js-cookie";

const SocketContext = createContext<Socket | null>(null);
const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useMemo(() => io(process.env.NEXT_PUBLIC_API_URL, {withCredentials: true, transports: ["websocket"], auth: { token: Cookies.get('accessToken')}}), []);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketProvider, useSocket };
