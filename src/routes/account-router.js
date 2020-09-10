const express = require("express");
const router = express.Router();
const {
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    InternalServerError,
} = require("../error-handling/errors");
const User = require("../data/models/user");
const UserLoginDTO = require("../data/dto/user-login-dto");
const UserUtilities = require("../data/models/utilities/user-utilities");
const AccountUtilities = require("../data/models/utilities/account-utilities");

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const error = UserUtilities.validateCredentialSchema(req.body);

        if (error) throw new BadRequest(null, null, error);

        const user = await User.findByCredentials(email, password);

        if (!user) throw new Unauthorized("Invalid username / password.");

        const token = AccountUtilities.generateAuthToken(user);

        res.status(200).send(new UserLoginDTO(user, token));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
