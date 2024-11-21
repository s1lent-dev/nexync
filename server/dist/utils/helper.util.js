import jwt from "jsonwebtoken";
import otp from 'otp-generator';
import { JWT_EXPIRE, JWT_REFRESH_EXPIRE, JWT_SECRET } from "../config/config.js";
import { generate } from "generate-password-ts";
import bcrypt from "bcrypt";
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
const generateTokens = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.userId }, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRE,
    });
};
const generatePassword = async () => {
    const password = generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
    });
    return { password };
};
const generateUsername = async () => {
    const username = generate({
        length: 8,
        numbers: false,
        symbols: false,
        lowercase: true,
        uppercase: true,
    });
    return { username };
};
const generateVerificationCode = async () => {
    const code = otp.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    const hashedCode = await hashCode(code);
    return { code, hashedCode };
};
const hashCode = async (code) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(code, salt);
};
const compareCode = async (code, hashedCode) => {
    return await comparePassword(code, hashedCode);
};
const generateResetPasswordToken = async (user) => {
    return jwt.sign({ id: user.userId }, JWT_SECRET, {
        expiresIn: '10m',
    });
};
const canUpdateUsername = async (user) => {
    try {
        if (!user.lastUsernameEdit) {
            return { canUpdate: true, remainingDays: 0 };
        }
        const timeDifference = Date.now() - new Date(user.lastUsernameEdit).getTime();
        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        if (timeDifference < sevenDaysInMilliseconds) {
            const remainingTime = sevenDaysInMilliseconds - timeDifference;
            const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
            return { canUpdate: false, remainingDays };
        }
        return { canUpdate: true, remainingDays: 0 };
    }
    catch (err) {
        console.error(err);
    }
};
export { hashPassword, comparePassword, generateTokens, generatePassword, generateUsername, generateVerificationCode, compareCode, generateResetPasswordToken, canUpdateUsername };