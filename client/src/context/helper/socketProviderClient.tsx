"use client";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // Client-side hooks
import Cookie from "js-cookie";

const SocketContext = createContext<Socket | null>(null);

const SocketProviderClient = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = Cookie.get("accessToken");

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, { 
            withCredentials: true, 
            transports: ["websocket"]
        });

        socketInstance.connect();
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            if (socket) {
                socket.disconnect();
                socket.connect();
            }
        };
        handleRouteChange();
    }, [socket, pathname, searchParams, accessToken]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProviderClient;
