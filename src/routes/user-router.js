const express = require("express");
const userRouter = express.Router();
const {
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    InternalServerError,
} = require("../error-handling/errors");
const { ObjectID } = require("mongodb");
const User = require("../data/models/user");
const UserDTO = require("../data/dto/user-dto");
const UserLoginDTO = require("../data/dto/user-login-dto");
const UserUtilities = require("../data/models/utilities/user-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");
const AccountUtilities = require("../data/models/utilities/account-utilities");
const { authMiddleware } = require("../middleware/auth");

// Get all users
userRouter.get("/", authMiddleware, async (req, res, next) => {
    try {
        console.log(JSON.stringify(req.user));
        const users = await User.find({});

        return res.status(200).send(UserUtilities.transformUsersToDtos(users));
    } catch (err) {
        next(err);
    }
});

userRouter.get("/me", authMiddleware, async (req, res, next) => {
    try {
        return res.status(200).send(new UserDTO(req.user));
    } catch (err) {
        next(err);
    }
});

// Get a single user by ID
userRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const user = await User.findById(id);

            if (!user) throw new NotFound(`A user with an ID of ${id} was not found in the database.`);

            res.status(200).send(new UserDTO(user));
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Create a new user
userRouter.post("/", async (req, res, next) => {
    try {
        const error = UserUtilities.validateSaveSchema(req.body);

        if (error) throw new BadRequest(null, null, error);

        const user = new User(req.body);
        user.password = await UserUtilities.hashPassword(req.body.password);

        await user.save();

        const token = AccountUtilities.generateAuthToken(user);

        res.status(201).send(new UserLoginDTO(user, token));
    } catch (err) {
        next(err);
    }
});

// Remove a user
userRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const user = await User.findByIdAndDelete(id);

            if (user) {
                res.status(204).send();
            } else {
                throw new NotFound(`A user with an ID of ${id} was not found in the database.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Update a user
userRouter.patch("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        let updates = req.body;
        const error = UserUtilities.validateUpdateSchema(updates);

        if (error) throw new BadRequest(null, null, error);

        if (ObjectID.isValid(id)) {
            const user = await User.findById(id);

            if (user) {
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

                const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

                res.status(200).send(new UserDTO(updatedUser));
            } else {
                throw new NotFound(`A user with an ID of ${id} was not found in the database.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = userRouter;
