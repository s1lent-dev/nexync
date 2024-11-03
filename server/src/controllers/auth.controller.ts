// Imports
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/db/prisma.db.js';
import { AsyncHandler, ErrorHandler, ResponseHandler } from '../utils/handlers.util.js';
import { CustomRequest, User } from '../types/types.js';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, COOKIE_OPTIONS, HTTP_STATUS_OK, FRONTEND_URL, HTTP_STATUS_ACCEPTED } from '../config/config.js';
import { comparePassword, generateTokens, hashPassword } from '../utils/helper.util.js';

// Controller
const RegisterUser = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    const UserExists = await prisma.user.findFirst({ where : { OR: [{ username }, { email }] } });
    if (UserExists) {
        return next(new ErrorHandler('User already exists', HTTP_STATUS_BAD_REQUEST));
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({ data: { username, email, password: hashedPassword } });
    res.status(HTTP_STATUS_CREATED).json(new ResponseHandler(HTTP_STATUS_CREATED, 'User created successfully', user));
});

const LoginUser = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if(!user) {
        return next(new ErrorHandler('Invalid credentials', HTTP_STATUS_BAD_REQUEST));
    }
    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) {
        return next(new ErrorHandler('Invalid credentials', HTTP_STATUS_BAD_REQUEST));
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(HTTP_STATUS_ACCEPTED).cookie('accessToken', accessToken, COOKIE_OPTIONS).cookie('refreshToken', refreshToken, COOKIE_OPTIONS).json(new ResponseHandler(HTTP_STATUS_ACCEPTED, 'User logged in successfully', user));
});

const LoginWithGoogle = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as {
        accessToken: string;
        refreshToken: string;
        user: User;
    };
    const { accessToken, refreshToken, user } = data;
    res.status(HTTP_STATUS_ACCEPTED).cookie("accessToken", accessToken, COOKIE_OPTIONS).cookie("refreshToken", refreshToken, COOKIE_OPTIONS).redirect(FRONTEND_URL);
});

const LoginWithGithub = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as {
        accessToken: string;
        refreshToken: string;
        user: User;
    };
    const { accessToken, refreshToken, user } = data;
    res.status(HTTP_STATUS_ACCEPTED).cookie("accessToken", accessToken, COOKIE_OPTIONS).cookie("refreshToken", refreshToken, COOKIE_OPTIONS).redirect(FRONTEND_URL);
});

const LogoutUser = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        return next(new ErrorHandler('Unauthorized', HTTP_STATUS_BAD_REQUEST));
    }
    res.clearCookie('accessToken', COOKIE_OPTIONS).clearCookie('refreshToken', COOKIE_OPTIONS).json(new ResponseHandler(HTTP_STATUS_OK, 'User logged out successfully', {}));
});

export {
    RegisterUser,
    LoginUser,
    LoginWithGoogle,
    LoginWithGithub,
    LogoutUser
}


