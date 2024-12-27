import { Server } from "socket.io";
import { FRONTEND_URL } from "../../config/config.js";
class SocketService {
    constructor(server) {
        this.userSocketsIds = new Map();
        this.getSockets = (memberIds) => {
            const sockets = memberIds.map((userId) => this.userSocketsIds.get(userId));
            return sockets;
        };
        this.isUserOnline = (userId) => {
            return this.userSocketsIds.has(userId);
        };
        this.io = new Server({
            cors: {
                origin: [FRONTEND_URL],
                methods: ["GET", "POST", "PUT", "DELETE"],
                credentials: true,
            },
        });
        this.io.attach(server);
        this.userSocketsIds = new Map();
        console.log("Socket.IO attached to the server");
        this.initSockets();
    }
    initSockets() {
        this.io.on("connection", (socket) => {
            const user = socket.request.user;
            if (this.userSocketsIds.has(user.userId)) {
                console.log(`User ${user.userId} already has an active socket: ${this.userSocketsIds.get(user.userId)}.`);
            }
            else {
                this.userSocketsIds.set(user.userId.toString(), socket.id);
            }
            this.registerEvents(socket);
            console.log("Current user sockets map: ", Array.from(this.userSocketsIds.entries()));
            console.log(`Client connected: ${socket.id}`);
            console.log("User connected: ", user);
            this.io.emit("online-status", { userId: user.userId, status: 'online' });
            // pubsub.publish('online-status', JSON.stringify({userId: user.userId, status: 'online'}))
            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
                this.userSocketsIds.delete(user.userId);
                this.io.emit("online-status", { userId: user.userId, status: 'offline' });
                // pubsub.publish('online-status', JSON.stringify({userId: user.userId, status: 'offline'}))
            });
        });
    }
    registerEvents(socket) {
        console.log("Base SocketService registerEvents called.");
    }
    getIo() {
        return this.io;
    }
}
export { SocketService };
