const express = require("express");
const router = express.Router();
const {
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    InternalServerError,
} = require("../error-handling/errors");
const { ObjectID } = require("mongodb");
const User = require("../data/models/user");
const BlacklistToken = require("../data/models/blacklist-token");
const Role = require("../data/models/role");
const UserLoginDTO = require("../data/dto/user-login-dto");
const UserRoleEnum = require("../enums/user-role-enum");
const UserUtilities = require("../data/models/utilities/user-utilities");
const TaskUtilities = require("../data/models/utilities/task-utilities");
const AccountUtilities = require("../data/models/utilities/account-utilities");
const UserDTO = require("../data/dto/user-dto");
const TaskDTO = require("../data/dto/task-dto");
const ProfileDTO = require("../data/dto/profile-dto");
const { authWrapper } = require("../middleware/auth");
const RoleUtilities = require("../data/models/utilities/role-utilities");

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const error = UserUtilities.validateCredentialSchema(req.body);

        if (error) throw new BadRequest(null, null, error);

        const user = await User.findByCredentials(email, password);

        if (!user) throw new Unauthorized("Invalid username / password.");

        await user.loadDynamics();

        const token = AccountUtilities.generateAuthToken(user);

        res.status(200).send(new UserLoginDTO(user, token));
    } catch (err) {
        next(err);
    }
});

// Register a new account
router.post("/register", async (req, res, next) => {
    try {
        const error = UserUtilities.validateSaveSchema(req.body);

        if (error) throw new BadRequest(null, null, error);

        const user = new User(req.body);
        user.password = await UserUtilities.hashPassword(req.body.password);
        user.roles.push(new ObjectID(process.env.STANDARD_USER_ROLE_ID));

        await user.save();
        await user.loadDynamics();

        const token = AccountUtilities.generateAuthToken(user);

        res.status(201).send(new UserLoginDTO(user, token));
    } catch (err) {
        next(err);
    }
});

router.get("/me", authWrapper(UserRoleEnum.USER), async (req, res, next) => {
    try {
        const user = req.user;
        await user.loadDynamics();

        const userDTO = new UserDTO(user);
        const profile = new ProfileDTO(userDTO);

        return res.status(200).send(profile);
    } catch (err) {
        next(err);
    }
});

router.post("/logout", authWrapper(UserRoleEnum.USER), async (req, res, next) => {
    try {
        const user = req.user;
        const token = req.token;

        const blacklistToken = new BlacklistToken({ token, reason: "User logged out.", user: user._id });

        await blacklistToken.save();

        res.status(200).send();
    } catch (err) {
        next(err);
    }
});

router.delete("/me", authWrapper(UserRoleEnum.USER), async (req, res, next) => {
    try {
        const user = req.user;
        await User.findByIdAndDelete(user._id);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

router.patch("/me", authWrapper(UserRoleEnum.USER), async (req, res, next) => {
    try {
        const user = req.user;
        let updates = req.body;
        const error = UserUtilities.validateUpdateSchema(updates);

        if (error) throw new BadRequest(null, null, error);

        if (updates.password) {
            var passwordMatch = await UserUtilities.unHashedPasswordMatchesHashed(
                updates.password,
                user.password
            );

            if (!passwordMatch) {
                updates.password = await UserUtilities.hashPassword(updates.password);
            } else {
                const { password, ...omitPw } = updates;
                updates = omitPw;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });
        await updatedUser.loadDynamics();

        res.status(200).send(new UserDTO(updatedUser));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
