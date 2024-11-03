import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/handlers.util.js";
import { NODE_ENV } from "../config/config.js";

const ErrorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const statusCode = (err instanceof ErrorHandler ? err.statusCode : 500) || 500;
    const message = err.message || "Internal Server Error";
    const response = {
        success: false,
        message,
        error: NODE_ENV === "DEVELOPMENT" ? err : undefined,
    };
    return res.status(statusCode).json(response); 
};
export { ErrorMiddleware };
