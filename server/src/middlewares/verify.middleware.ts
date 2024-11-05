import { Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { prisma } from "../lib/db/prisma.db.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.util.js";
import { CustomRequest, User as IUser} from "../types/types.js";
import { HTTP_STATUS_UNAUTHORIZED, JWT_SECRET } from "../config/config.js";

const verifyToken = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } })) as unknown as IUser;
        if (!user) {
        return next(new ErrorHandler("User doesnt exist with given userId", HTTP_STATUS_UNAUTHORIZED));
        }
        req.user = user;
        next();
    });
});

const verifyRefreshToken = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } })) as unknown as IUser;
        if (!user) {
        return next(new ErrorHandler("User doesnt exist with given userId", HTTP_STATUS_UNAUTHORIZED));
        }
        req.user = user;
        next();
    });
});

export { verifyToken, verifyRefreshToken };