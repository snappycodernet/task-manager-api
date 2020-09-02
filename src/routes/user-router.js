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
const UserUtilities = require("../data/models/utilities/user-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");

// Get all users
userRouter.get("/", async (req, res, next) => {
    try {
        const users = await User.find({});

        return res.status(200).send(users);
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

            res.status(200).send(user);
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
        const user = new User(req.body);
        await user.save();

        res.status(201).send(user);
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
        const updates = req.body;
        const userUtil = new UserUtilities();
        const results = userUtil.validateSchema(updates);

        if (!results.success) {
            throw new BadRequest(
                `The updates provided contained fields that do not exist on the model schema: ${results.invalidFields.join(
                    ","
                )}.`
            );
        }

        if (ObjectID.isValid(id)) {
            const user = await User.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
            }).catch((err) => {
                if (MongooseUtilities.isMongooseError(err)) {
                    throw new BadRequest(err.message, err.name);
                }

                throw err;
            });

            if (user) {
                res.status(200).send(user);
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
