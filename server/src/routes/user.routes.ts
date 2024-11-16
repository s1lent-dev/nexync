import { Router } from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { acceptConnectionRequest, getAllConnections, getConnectionRequests, getMe, getMyConnections, getSuggestions, removeFollowing, removeFollwers, searchUsers, sendConnectionRequest, unsendConnectionRequest, updateBio, updateUsername, uploadAvatar } from "../controllers/user.controller.js";
import { multerSingleUpload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route('/me').get(verifyToken, getMe);
userRouter.route("/get-connections").get(verifyToken, getMyConnections);
userRouter.route('/connections').get(verifyToken, getAllConnections);
userRouter.route("/search").post(verifyToken, searchUsers);
userRouter.route("/get-suggestions").get(verifyToken, getSuggestions);
userRouter.route("/get-requests").get(verifyToken, getConnectionRequests);
userRouter.route("/send-request/:userId").post(verifyToken, sendConnectionRequest);
userRouter.route("/cancel-request/:userId").delete(verifyToken, unsendConnectionRequest);
userRouter.route("/accept-request/:userId/:status").post(verifyToken, acceptConnectionRequest);
userRouter.route('/remove-follower/:userId').delete(verifyToken, removeFollwers);
userRouter.route("/remove-following/:userId").delete(verifyToken, removeFollowing);
userRouter.route("/update-username").put(verifyToken, updateUsername);
userRouter.route("/upload-avatar").put(verifyToken, multerSingleUpload('photo'), uploadAvatar);
userRouter.route("/update-bio").put(verifyToken, updateBio);

export default userRouter;