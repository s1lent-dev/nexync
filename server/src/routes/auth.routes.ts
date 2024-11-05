import { Router } from "express";
import { RegisterUser, LoginUser, LoginWithGoogle, LoginWithGithub, LogoutUser, refreshToken } from "../controllers/auth.controller.js";
import { validateUser } from "../middlewares/validate.middleware.js";
import passport from "passport";
import { verifyRefreshToken } from "../middlewares/verify.middleware.js";

const authRouter = Router();

// Routes
authRouter.route('/google').get(passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.route('/github').get(passport.authenticate("github", { scope: ["user:email"] }));
authRouter.route('/google/callback').get(passport.authenticate("google", { session: false }), LoginWithGoogle);
authRouter.route('/github/callback').get(passport.authenticate("github", { session: false }), LoginWithGithub);
authRouter.route('/register').post(validateUser, RegisterUser);
authRouter.route('/login').post(LoginUser);
authRouter.route('/logout').get(LogoutUser);
authRouter.route('/refresh-token').post(verifyRefreshToken, refreshToken);

export default authRouter;
