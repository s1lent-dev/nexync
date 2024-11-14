"use client";
import { io, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // Use Next.js hooks

const SocketContext = createContext<Socket | null>(null);
const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, { 
            withCredentials: true, 
            transports: ["websocket"]
        });

        // Connect the socket when it's created
        socketInstance.connect();
        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []); // Empty dependency array, initializes once on mount

    useEffect(() => {
        // Reinitialize socket on route change
        const handleRouteChange = () => {
            if (socket) {
                socket.disconnect();
                socket.connect();
            }
        };
        handleRouteChange();

    }, [socket, pathname, searchParams]); // Re-run when socket, pathname, or searchParams changes

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, useSocket };
