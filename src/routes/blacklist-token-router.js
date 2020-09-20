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
const BlacklistToken = require("../data/models/blacklist-token");
const User = require("../data/models/user");
const BlacklistTokenDTO = require("../data/dto/blacklist-token-dto");
const UserDTO = require("../data/dto/user-dto");
const UserRoleEnum = require("../enums/user-role-enum");
const BlacklistTokenUtilities = require("../data/models/utilities/blacklist-token-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");
const { authWrapper } = require("../middleware/auth");

// Get all role
router.get("/", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const blacklistTokens = await BlacklistToken.find({});

        res.status(200).send(BlacklistTokenUtilities.transformBlacklistTokensToDtos(blacklistTokens));
    } catch (err) {
        next(err);
    }
});

// Get a single role by ID
router.get("/:id", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const blacklistToken = await BlacklistToken.findById(id);

            if (!blacklistToken)
                throw new NotFound(`A blacklisted token with an ID of ${id} was not found in the database.`);

            res.status(200).send(new BlacklistTokenDTO(blacklistToken));
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Create a new role
router.post("/", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const error = BlacklistTokenUtilities.validateSaveSchema(req.body);

        if (error) throw new BadRequest(null, null, error);

        const blacklistToken = new BlacklistToken(req.body);

        await blacklistToken.save();

        res.status(201).send(new BlacklistTokenDTO(blacklistToken));
    } catch (err) {
        next(err);
    }
});

// Remove a role
router.delete("/:id", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const blacklistToken = await BlacklistToken.findByIdAndDelete(id);

            if (blacklistToken) {
                res.status(204).send();
            } else {
                throw new NotFound(`A blacklisted token with an ID of ${id} was not found in the database.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Update a role
router.patch("/:id", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const id = req.params.id;
        let updates = req.body;
        const error = BlacklistTokenUtilities.validateUpdateSchema(updates);

        if (error) throw new BadRequest(null, null, error);

        if (ObjectID.isValid(id)) {
            const blacklistToken = await BlacklistToken.findById(id);

            if (blacklistToken) {
                const updatedBlacklistToken = await BlacklistToken.findByIdAndUpdate(id, updates, {
                    new: true,
                });

                res.status(200).send(new BlacklistTokenDTO(updatedBlacklistToken));
            } else {
                throw new NotFound(`A blacklisted token with an ID of ${id} was not found.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
