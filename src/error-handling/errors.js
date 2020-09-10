class GeneralError extends Error {
    constructor(message, statusCode, name, error) {
        super();
        error ? (this.message = error.message) : (this.message = message),
            error ? (this.stack = error.stack) : (this.stack = this.stack),
            error ? (this.name = error.name) : (this.name = name || this.name);
        this.statusCode = statusCode;
    }

    getCode() {
        return this.statusCode;
    }
}

class BadRequest extends GeneralError {
    constructor(message, name, error) {
        super(message, 400, name, error);
    }
} // 400
class Unauthorized extends GeneralError {
    constructor(message, name, error) {
        super(message, 401, name, error);
    }
} // 401
class Forbidden extends GeneralError {
    constructor(message, name, error) {
        super(message, 403, name, error);
    }
} // 403
class NotFound extends GeneralError {
    constructor(message, name, error) {
        super(message, 404, name, error);
    }
} // 404
class InternalServerError extends GeneralError {
    constructor(message, name, error) {
        super(message, 500, name, error);
    }
} // 500

module.exports = {
    GeneralError,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    InternalServerError,
};
