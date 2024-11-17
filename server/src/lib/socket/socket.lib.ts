import { Server, Socket } from "socket.io";
import http, { IncomingMessage} from "http";
import { User as IUser } from "../../types/types";
import { pubsub } from "../../app.js";

interface CustomSocket extends Socket {
  request: IncomingMessage & { user: IUser };
}


class SocketService {
  protected io!: Server;
  protected userSocketsIds: Map<string, string> = new Map();
  constructor(server: http.Server) {
    this.io = new Server({
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ["GET", "POST"],
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
      console.log("Current user sockets map: ", Array.from(this.userSocketsIds.entries()));
      console.log(`Client connected: ${socket.id}`);
      console.log("User connected: ", user);
      this.registerEvents(socket);
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.userSocketsIds.delete(user.userId);
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

  public getIo() {
    return this.io;
  }
}

export { SocketService };
