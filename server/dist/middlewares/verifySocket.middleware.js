import cookie from 'cookie';
import { prisma } from "../lib\/db/prisma.db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
const verifySocket = async (err, socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
        return next(new Error("Access denied. No cookies provided."));
    }
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.accessToken; // Extract the token from parsed cookies
    console.log("Token: ", token);
    if (!token) {
        return next(new Error("Access denied. No token provided."));
    }
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return next(new Error("Unauthorized"));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } }));
        if (!user) {
            return next(new Error("Unauthorized"));
        }
        console.log("User socket verified: ", user);
        socket.request.user = user;
        next();
    });
};
export { verifySocket };
