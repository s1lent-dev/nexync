import { Socket } from "socket.io";
import { prisma } from "../lib\/db/prisma.db.js";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { User as IUser } from "../types/types.js";
import { NextFunction } from "express";
import { IncomingMessage } from "http";

interface CustomSocket extends Socket {
    request: IncomingMessage & { user: IUser };
}

const verifySocket = async (err: any, socket: CustomSocket, next: NextFunction) => {
    const token = socket.handshake.headers.cookie?.split("=")[1];
    console.log("Token: ", token);
    if (!token) {
        return next(new Error("Access denied. No token provided."));
    }

    jwt.verify(token, "Secret", async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new Error("Unauthorized"));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } })) as IUser;
        if (!user) {
            return next(new Error("Unauthorized"));
        }
        console.log("User socket verified: ", user);
        socket.request.user = user;
        next();
    });
}

export { verifySocket };