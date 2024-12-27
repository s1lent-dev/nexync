"use client";

import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

const SocketContext = createContext<Socket | null>(null);

const SocketProviderClient = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, { 
            withCredentials: true, 
            transports: ["websocket"] 
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProviderClient;
export { SocketContext };
