import { Server } from "socket.io";
class SocketService {
    constructor() {
        this.io = null;
        this.initListeners = () => {
            const io = this.io;
            io?.on("connection", (socket) => {
                console.log("A user connected with socket id: ", socket.id);
                socket.on("msg", (msg) => {
                    console.log("Message received: ", msg);
                    io?.emit("msg", msg);
                });
                socket.on("disconnect", () => {
                    console.log("Client Disconnected with socket id", socket.id);
                });
            });
        };
        this.getSocketServer = () => {
            return this.io;
        };
        console.log("Initializing Socket Service...");
        this.io = new Server({
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
    }
}
const socketService = new SocketService();
const io = socketService.getSocketServer();
export { socketService, io };
