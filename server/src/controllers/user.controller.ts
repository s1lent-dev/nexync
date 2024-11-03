import { Request, Response, NextFunction } from "express";
import { AsyncHandler, ErrorHandler, ResponseHandler } from "../utils/handlers.util.js";
import { uploadToS3 } from "../services/aws.service.js";
import { CustomRequest } from "../types/types.js";
import { prisma } from "../lib/db/prisma.db.js";


const uploadAvatar = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const filePath = req.file?.path;
    const contentType = req.file?.mimetype;
    const fileName = req.file?.filename;
    const user = req.user;
    if (!filePath || !contentType || !fileName) {
        return next (new ErrorHandler("File not uploaded", 400));
    }
    const avatarUrl = await uploadToS3(filePath, fileName, contentType);
    await prisma.user.update({
        where: { userId: user?.userId },
        data: { avatarUrl },
    });
    res.json(new ResponseHandler(200, "File uploaded successfully", avatarUrl));
});


export { uploadAvatar };