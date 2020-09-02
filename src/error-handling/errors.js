class GeneralError extends Error {
    constructor(message, statusCode, name) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        name ? (this.name = name) : (this.name = this.name);
    }

    getCode() {
        return this.statusCode;
    }
}

class BadRequest extends GeneralError {
    constructor(message, name) {
        super(message, 400, name);
    }
} // 400
class Unauthorized extends GeneralError {
    constructor(message, name) {
        super(message, 401, name);
    }
} // 401
class Forbidden extends GeneralError {
    constructor(message, name) {
        super(message, 403, name);
    }
} // 403
class NotFound extends GeneralError {
    constructor(message, name) {
        super(message, 404, name);
    }
} // 404
class InternalServerError extends GeneralError {
    constructor(message, name) {
        super(message, 500, name);
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
