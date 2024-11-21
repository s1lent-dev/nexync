const AsyncHandler = (reqHandler) => (req, res, next) => {
    return Promise.resolve(reqHandler(req, res, next)).catch(next);
};
export { AsyncHandler };
