class appError extends Error {
    statusCode: any;
    isOperational: boolean;
    constructor(statusCode: any, message: any, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        stack ? this.stack = stack : Error.captureStackTrace(this, this.constructor)
    }
}

export {appError}; 