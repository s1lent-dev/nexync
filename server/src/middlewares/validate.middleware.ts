import { Request, Response, NextFunction } from "express";
import { ChatSchema, MessageSchema, UserChatSchema, UserSchema } from "../schemas/validation.schema.js";
import { AsyncHandler } from "../utils/handlers.util.js";

const validateUser = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    UserSchema.parse(req.body);
    next();
});

const validateMessage = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    MessageSchema.parse(req.body);
    next();
});

const validateChat = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    ChatSchema.parse(req.body);
    next();
});

const validateUserChat = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    UserChatSchema.parse(req.body);
    next();
});

export { validateUser, validateMessage, validateChat, validateUserChat };