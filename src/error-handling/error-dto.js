class ErrorDTO {
    constructor(status, message, name) {
        this.status = status;
        this.message = message;
        this.name = name;
    }
}

class DetailedErrorDTO {
    constructor(status, message, stackTrace, name) {
        this.status = status;
        this.message = message;
        this.stackTrace = stackTrace;
        this.name = name;
    }
}

module.exports = {
    ErrorDTO,
    DetailedErrorDTO,
};
