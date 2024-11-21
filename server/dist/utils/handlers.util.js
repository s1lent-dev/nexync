const AsyncHandler = (reqHandler) => (req, res, next) => {
    return Promise.resolve(reqHandler(req, res, next)).catch(next);
};
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
;
class ResponseHandler {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}
;
export { AsyncHandler, ErrorHandler, ResponseHandler };
