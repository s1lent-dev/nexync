import { Server, Socket } from "socket.io";
import http, { IncomingMessage} from "http";
import { User as IUser, MessageEvent } from "../../types/types";
import { FRONTEND_URL } from "../../config/config.js";
import { kafka } from "../../app.js";

interface CustomSocket extends Socket {
  request: IncomingMessage & { user: IUser };
}


class SocketService {
  protected io!: Server;
  protected userSocketsIds: Map<string, string> = new Map();
  constructor(server: http.Server) {
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
    this.initSockets()
  }
  

  private initSockets() {
    this.io.on("connection", (socket: Socket) => {
      const user = (socket as CustomSocket).request.user;
      if (this.userSocketsIds.has(user.userId)) {
        console.log(`User ${user.userId} already has an active socket: ${this.userSocketsIds.get(user.userId)}.`);
      } else {
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

  protected registerEvents(socket: Socket) {
    console.log("Base SocketService registerEvents called.");
  }

  protected getSockets = (memberIds: string[]) => {
    const sockets = memberIds.map((userId)=> this.userSocketsIds.get(userId));
    return sockets;
  }

  public isUserOnline = (userId: string) => {
    return this.userSocketsIds.has(userId);
  }

  public getIo() {
    return this.io;
  }
}

export { SocketService };
