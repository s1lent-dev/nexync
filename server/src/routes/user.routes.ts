import { Router } from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { uploadAvatar } from "../controllers/user.controller.js";
import { multerSingleUpload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/upload-avatar").put(verifyToken, multerSingleUpload('photo'), uploadAvatar);

export default userRouter;