const mongoose = require("mongoose");

class MongooseUtilities {
    static isMongooseError(err) {
        return err instanceof mongoose.Error;
    }
}

module.exports = MongooseUtilities;
