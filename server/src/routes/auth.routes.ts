import { Router } from "express";
import { RegisterUser, LoginUser, LoginWithGoogle, LoginWithGithub, LogoutUser, refreshToken, CheckUsername, CheckEmail, VerifyEmail, VerifyCode } from "../controllers/auth.controller.js";
import { validateUser } from "../middlewares/validate.middleware.js";
import passport from "passport";
import { verifyRefreshToken, verifyToken } from "../middlewares/verify.middleware.js";

const authRouter = Router();

// Routes
authRouter.route('/google').get(passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.route('/github').get(passport.authenticate("github", { scope: ["user:email"] }));
authRouter.route('/google/callback').get(passport.authenticate("google", { session: false }), LoginWithGoogle);
authRouter.route('/github/callback').get(passport.authenticate("github", { session: false }), LoginWithGithub);
authRouter.route('/check-username').post(CheckUsername);
authRouter.route('/check-email').post(CheckEmail);
authRouter.route('/verify-email').post(VerifyEmail);
authRouter.route('/register').post(validateUser, VerifyCode, RegisterUser);
authRouter.route('/login').post(LoginUser);
authRouter.route('/logout').get(verifyToken, LogoutUser);
authRouter.route('/refresh-token').post(verifyRefreshToken, refreshToken);

export default authRouter;
