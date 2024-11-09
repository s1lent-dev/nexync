import { Router } from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { getMessages, getAllConnectionsChats } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.route("/get-connections-chats").get(verifyToken, getAllConnectionsChats);
chatRouter.route("/get-messages/:chatId").get(verifyToken, getMessages);

export default chatRouter;