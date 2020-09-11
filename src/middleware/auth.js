const jwt = require("jsonwebtoken");
const User = require("../data/models/user");
const {
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    InternalServerError,
} = require("../error-handling/errors");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        const key = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, key);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }

        req.user = user;

        next();
    } catch (err) {
        next(new Unauthorized("User authentication failed."));
    }
};

module.exports = {
    authMiddleware,
};
