"use client";
import { io, Socket } from "socket.io-client";
import { createContext, useContext, useMemo } from "react";

const SocketContext = createContext<Socket | null>(null);
const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useMemo(() => io("http://localhost:5000", {withCredentials: true, transports: ["websocket"], auth: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzMwMjA4MjA5LCJleHAiOjE3MzI4MDAyMDl9.Bvz9fTDGcGsQVz6V8HKHVVlX8LuWL030smmc1jENUtM'}}), []);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketProvider, useSocket };
