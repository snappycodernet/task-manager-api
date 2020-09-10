const jwt = require("jsonwebtoken");

class AccountUtilities {
    static generateAuthToken(user) {
        const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRY,
        });

        return token;
    }
}

module.exports = AccountUtilities;
