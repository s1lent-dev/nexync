import { Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { prisma } from "../lib/db/prisma.db.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.util.js";
import { CustomRequest, User as IUser} from "../types/types.js";

const verifyToken = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", 401));
    }
    jwt.verify(token, "Secret", async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", 401));
        const user = (await prisma.user.findUnique({ where: { userId: decoded.id } })) as IUser;
        // const user = (await User.findById(decoded.id).select("-password -refreshToken")) as IUser;
        if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
        }
        req.user = user;
        next();
    });
});

export { verifyToken };