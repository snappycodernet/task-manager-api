const jwt = require("jsonwebtoken");
const User = require("../data/models/user");
const {
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    InternalServerError,
} = require("../error-handling/errors");
const { isMongooseError } = require("../utilities/mongoose-utils");

const authWrapper = (args) => {
    const roles = [args];

    const authMiddleware = async (req, res, next) => {
        try {
            const token = req.header("Authorization").split(" ")[1];
            const key = process.env.SECRET_KEY;
            const decoded = jwt.verify(token, key);
            const user = await User.findOne({ _id: decoded._id });
            await user.populate("roles").execPopulate();

            if (!user) throw new Error();

            // find user roles and check if any are included in the roles argument passed in from authWrapper
            const userRoleNames = user.roles.map((r) => r.name);
            userHasRole = userRoleNames.some((r) => roles.includes(r));

            if (!userHasRole) throw new Error();

            req.user = user;

            next();
        } catch (err) {
            next(new Unauthorized("User authorization has failed."));
        }
    };

    return authMiddleware;
};

module.exports = {
    authWrapper,
};
