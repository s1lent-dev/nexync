import { prisma } from '../lib/db/prisma.db.js';
import { AsyncHandler, ErrorHandler, ResponseHandler } from '../utils/handlers.util.js';
import { MailType } from '../types/types.js';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, COOKIE_OPTIONS, HTTP_STATUS_OK, FRONTEND_URL, HTTP_STATUS_ACCEPTED, HTTP_STATUS_UNAUTHORIZED } from '../config/config.js';
import { compareCode, comparePassword, generateResetPasswordToken, generateTokens, generateVerificationCode, hashPassword } from '../utils/helper.util.js';
import { emailQueue } from '../app.js';
// Controllers
const VerifyEmail = AsyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const UserExists = await prisma.user.findFirst({ where: { email } });
    if (UserExists) {
        return next(new ErrorHandler('User already exists', HTTP_STATUS_BAD_REQUEST));
    }
    const { code, hashedCode } = await generateVerificationCode();
    await prisma.verificationCode.create({ data: { email, code: hashedCode, expiresAt: new Date(Date.now() + 1000 * 60 * 2) } });
    emailQueue.sendVerifyEmail({ email, contentType: MailType.VERIFY_EMAIL, content: code });
    res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, 'Verification code sent successfully', {}));
});
const VerifyCode = AsyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { code } = req.query;
    const verificationCode = await prisma.verificationCode.findFirst({ where: { email } });
    if (!verificationCode) {
        return next(new ErrorHandler('Invalid code', HTTP_STATUS_BAD_REQUEST));
    }
    const isMatch = await compareCode(code, verificationCode.code);
    if (!isMatch) {
        return next(new ErrorHandler('Verification code doesnt match !', HTTP_STATUS_BAD_REQUEST));
    }
    await prisma.verificationCode.delete({ where: { email } });
    next();
});
const CheckUsername = AsyncHandler(async (req, res, next) => {
    const { username } = req.query;
    const user = await prisma.user.findFirst({ where: { username: username } });
    if (user) {
        return res.json(new ResponseHandler(HTTP_STATUS_BAD_REQUEST, 'Username already exists', {}));
    }
    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, 'Username is available', {}));
});
const CheckEmail = AsyncHandler(async (req, res, next) => {
    const { email } = req.query;
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (user) {
        return res.json(new ResponseHandler(HTTP_STATUS_BAD_REQUEST, 'Email already exists', {}));
    }
    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, 'Email is available', {}));
});
const RegisterUser = AsyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    const UserExists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (UserExists) {
        return next(new ErrorHandler('User already exists', HTTP_STATUS_BAD_REQUEST));
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({ data: { username, email, password: hashedPassword } });
    res.status(HTTP_STATUS_CREATED).json(new ResponseHandler(HTTP_STATUS_CREATED, 'User created successfully', user));
});
const LoginUser = AsyncHandler(async (req, res, next) => {
    const { usernameOrEmail, password } = req.body;
    const isEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(usernameOrEmail);
    const user = await prisma.user.findFirst({ where: isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail } });
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', HTTP_STATUS_BAD_REQUEST));
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid credentials', HTTP_STATUS_BAD_REQUEST));
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(HTTP_STATUS_ACCEPTED).cookie('accessToken', accessToken, COOKIE_OPTIONS).cookie('refreshToken', refreshToken, COOKIE_OPTIONS).json(new ResponseHandler(HTTP_STATUS_ACCEPTED, 'User logged in successfully', user));
});
const LoginWithGoogle = AsyncHandler(async (req, res, next) => {
    const data = req.user;
    const { accessToken, refreshToken, user } = data;
    res.status(HTTP_STATUS_ACCEPTED).cookie("accessToken", accessToken, COOKIE_OPTIONS).cookie("refreshToken", refreshToken, COOKIE_OPTIONS).redirect(FRONTEND_URL);
});
const LoginWithGithub = AsyncHandler(async (req, res, next) => {
    const data = req.user;
    const { accessToken, refreshToken, user } = data;
    res.status(HTTP_STATUS_ACCEPTED).cookie("accessToken", accessToken, COOKIE_OPTIONS).cookie("refreshToken", refreshToken, COOKIE_OPTIONS).redirect(FRONTEND_URL);
});
const LogoutUser = AsyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler('Unauthorized', HTTP_STATUS_BAD_REQUEST));
    }
    res.clearCookie('accessToken', COOKIE_OPTIONS).clearCookie('refreshToken', COOKIE_OPTIONS).json(new ResponseHandler(HTTP_STATUS_OK, 'User logged out successfully', {}));
});
const RefreshToken = AsyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler('Unauthorized', HTTP_STATUS_UNAUTHORIZED));
    }
    const { accessToken, refreshToken } = await generateTokens(req.user);
    res.status(HTTP_STATUS_OK).cookie('accessToken', accessToken, COOKIE_OPTIONS).cookie('refreshToken', refreshToken, COOKIE_OPTIONS).json(new ResponseHandler(HTTP_STATUS_OK, 'Token refreshed successfully', {}));
});
const ForgotPassword = AsyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
        return next(new ErrorHandler('User not found', HTTP_STATUS_BAD_REQUEST));
    }
    const token = await generateResetPasswordToken(user);
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    emailQueue.sendPasswordResetEmail({ email, contentType: MailType.RESET_PASSWORD, content: resetLink });
    res.status(HTTP_STATUS_OK).cookie('resetToken', token, COOKIE_OPTIONS).json(new ResponseHandler(HTTP_STATUS_OK, 'Reset link sent successfully', {}));
});
const ResetPassword = AsyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const user = req.user;
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({ where: { userId: user.userId }, data: { password: hashedPassword } });
    res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, 'Password reset successfully', {}));
});
export { VerifyEmail, VerifyCode, CheckUsername, CheckEmail, RegisterUser, LoginUser, LoginWithGoogle, LoginWithGithub, LogoutUser, RefreshToken, ForgotPassword, ResetPassword };
