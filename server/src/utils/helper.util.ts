import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_REFRESH_EXPIRE, JWT_SECRET } from "../config/config.js";
import { generate } from "generate-password-ts";
import bcrypt from "bcrypt";
import { User } from "../types/types.js";
import { prisma } from "../lib/db/prisma.db.js";


const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateTokens = async (user: User) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
}
const generateAccessToken = (user: User) => {
    return jwt.sign({ id: user.userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });
}

const generateRefreshToken = (user: User) => {
    return jwt.sign({ id: user.userId }, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRE,
    });
}

const generatePassword = async () => {
    const password = generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
    });
    return { password };
}

const generateUsername = async () => {
    const username = generate({
        length: 8,
        numbers: false,
        symbols: false,
        lowercase: true,
        uppercase: true,
    });
    return { username };
}

export { hashPassword, comparePassword, generateTokens, generatePassword, generateUsername };