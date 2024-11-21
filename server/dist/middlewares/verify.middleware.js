import jwt from "jsonwebtoken";
import { prisma } from "../lib/db/prisma.db.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.util.js";
import { HTTP_STATUS_UNAUTHORIZED, JWT_SECRET } from "../config/config.js";
const verifyToken = AsyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } }));
        if (!user) {
            return next(new ErrorHandler("User doesnt exist with given userId", HTTP_STATUS_UNAUTHORIZED));
        }
        req.user = user;
        next();
    });
});
const verifyRefreshToken = AsyncHandler(async (req, res, next) => {
    const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } }));
        if (!user) {
            return next(new ErrorHandler("User doesnt exist with given userId", HTTP_STATUS_UNAUTHORIZED));
        }
        req.user = user;
        next();
    });
});
const verifyResetPasswordToken = AsyncHandler(async (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } }));
        if (!user) {
            return next(new ErrorHandler("User doesnt exist with given userId", HTTP_STATUS_UNAUTHORIZED));
        }
        req.user = user;
        next();
    });
});
export { verifyToken, verifyRefreshToken, verifyResetPasswordToken };
