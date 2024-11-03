import { Request, Response, NextFunction } from "express";

const AsyncHandler = (reqHandler: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(reqHandler(req, res, next)).catch(next);
};

class ErrorHandler extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
};

class ResponseHandler { 
    constructor(public statusCode : number , public message : string, public data : any) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
};

export { AsyncHandler, ErrorHandler, ResponseHandler };