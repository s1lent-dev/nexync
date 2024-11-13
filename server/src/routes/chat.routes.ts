import { Router } from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { GetMessages, GetConnectionChats, GetGroupChats, CreateGroupChat, RenameGroupChat, ChangeGroupChatTagline, AddNewMemberToGroupChat, AddNewMembersToGroupChat, RemoveMemberFromGroupChat, LeaveGroupChat } from "../controllers/chat.controller.js";
import { multerSingleUpload } from "../middlewares/multer.middleware.js";

const chatRouter = Router();

chatRouter.route('/create-group').post(verifyToken, multerSingleUpload('photo'), CreateGroupChat);
chatRouter.route('/rename-group').put(verifyToken, RenameGroupChat);
chatRouter.route('/rename-tagline').put(verifyToken, ChangeGroupChatTagline);
chatRouter.route('/add-member').post(verifyToken, AddNewMemberToGroupChat);
chatRouter.route('/add-members').post(verifyToken, AddNewMembersToGroupChat);
chatRouter.route('/remove-member').delete(verifyToken, RemoveMemberFromGroupChat);
chatRouter.route('/leave-group').delete(verifyToken, LeaveGroupChat);
chatRouter.route("/get-connection-chats").get(verifyToken, GetConnectionChats);
chatRouter.route("/get-group-chats").get(verifyToken, GetGroupChats);
chatRouter.route("/get-messages/:chatId").get(verifyToken, GetMessages);

export default chatRouter;