const { GeneralError } = require("./errors");
const { ErrorDTO, DetailedErrorDTO } = require("./error-dto");

class ErrorHandlerDistributor {
    static developmentErrorHandler(err, req, res, next) {
        var errorDto = new DetailedErrorDTO("error", err.message, err.stack, err.name);

        if (err instanceof GeneralError) {
            return res.status(err.getCode()).json(errorDto);
        }

        return res.status(500).json(errorDto);
    }

    static productionErrorHandler(err, req, res, next) {
        var errorDto = new ErrorDTO("error", err.message, err.name);

        if (err instanceof GeneralError) {
            return res.status(err.getCode()).json(errorDto);
        }

        return res.status(500).json(errorDto);
    }

    static getErrorHandler() {
        const environment = process.env.APP_ENV;
        if (environment === "development") return this.developmentErrorHandler;

        return this.productionErrorHandler;
    }
}

module.exports = ErrorHandlerDistributor;
