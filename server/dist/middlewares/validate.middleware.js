import { ChatSchema, MessageSchema, UserChatSchema, UserSchema } from "../schemas/validation.schema.js";
import { AsyncHandler } from "../utils/handlers.util.js";
const validateUser = AsyncHandler(async (req, res, next) => {
    UserSchema.parse(req.body);
    next();
});
const validateMessage = AsyncHandler(async (req, res, next) => {
    MessageSchema.parse(req.body);
    next();
});
const validateChat = AsyncHandler(async (req, res, next) => {
    ChatSchema.parse(req.body);
    next();
});
const validateUserChat = AsyncHandler(async (req, res, next) => {
    UserChatSchema.parse(req.body);
    next();
});
export { validateUser, validateMessage, validateChat, validateUserChat };
