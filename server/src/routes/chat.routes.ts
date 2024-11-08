import { Router } from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { getChatsWithUser } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.route("/get-chats/:userId").get(verifyToken, getChatsWithUser);

export default chatRouter;