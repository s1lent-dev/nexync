import { Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { prisma } from "../lib/db/prisma.db.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.util.js";
import { CustomRequest, User as IUser} from "../types/types.js";
import { JWT_SECRET } from "../config/config.js";

const verifyToken = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", 401));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", 401));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } })) as unknown as IUser;
        if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
        }
        req.user = user;
        next();
    });
});

export { verifyToken };