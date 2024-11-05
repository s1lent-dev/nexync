import { Router } from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { acceptConnectionRequest, getMe, getMyConnections, searchUsers, sendConnectionRequest, updateBio, uploadAvatar } from "../controllers/user.controller.js";
import { multerSingleUpload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route('/me').get(verifyToken, getMe);
userRouter.route("/search").post(verifyToken, searchUsers);
userRouter.route("/send-request/:userId").post(verifyToken, sendConnectionRequest);
userRouter.route("/accept-request/:userId/:status").post(verifyToken, acceptConnectionRequest);
userRouter.route("/get-connections").get(verifyToken, getMyConnections);
userRouter.route("/upload-avatar").put(verifyToken, multerSingleUpload('photo'), uploadAvatar);
userRouter.route("/update-bio").put(verifyToken, updateBio);

export default userRouter;