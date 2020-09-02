const User = require("../user");
const UtilitiesShared = require("./utilities-shared");

class UserUtilities extends UtilitiesShared {
    constructor() {
        super(User);
    }
}

module.exports = UserUtilities;
