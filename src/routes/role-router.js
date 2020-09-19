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
const Role = require("../data/models/role");
const User = require("../data/models/user");
const RoleDTO = require("../data/dto/role-dto");
const UserDTO = require("../data/dto/user-dto");
const UserRoleEnum = require("../enums/user-role-enum");
const RoleUtilities = require("../data/models/utilities/role-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");
const { authWrapper } = require("../middleware/auth");

// Get all role
router.get("/", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const roles = await Role.find({});

        res.status(200).send(RoleUtilities.transformRolesToDtos(roles));
    } catch (err) {
        next(err);
    }
});

// Get a single role by ID
router.get("/:id", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const role = await Role.findById(id);

            if (!role) throw new NotFound(`A role with an ID of ${id} was not found in the database.`);

            res.status(200).send(new RoleDTO(role));
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
        const error = RoleUtilities.validateSaveSchema(req.body);

        if (error) throw new BadRequest(null, null, error);

        const role = new Role(req.body);

        await role.save();

        res.status(201).send(new RoleDTO(role));
    } catch (err) {
        next(err);
    }
});

// Remove a role
router.delete("/:id", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const role = await Role.findByIdAndDelete(id);

            if (role) {
                res.status(204).send();
            } else {
                throw new NotFound(`A role with an ID of ${id} was not found in the database.`);
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
        const error = RoleUtilities.validateUpdateSchema(updates);

        if (error) throw new BadRequest(null, null, error);

        if (ObjectID.isValid(id)) {
            const role = await Role.findById(id);

            if (role) {
                const updatedRole = await Role.findByIdAndUpdate(id, updates, { new: true });

                res.status(200).send(new RoleDTO(updatedRole));
            } else {
                throw new NotFound(`A role with an ID of ${id} was not found.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

router.patch("/assign/:uid/:rid", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const { uid, rid } = req.params;

        if (!ObjectID.isValid(uid)) throw new BadRequest("Must provide a valid user id.");
        if (!ObjectID.isValid(rid)) throw new BadRequest("Must provide a valid role id.");

        const user = await User.findById(uid);
        const role = await Role.findById(rid);

        if (!user) throw new NotFound(`A user with an ID of ${id} was not found in the database.`);
        if (!role) throw new NotFound(`A role with an ID of ${id} was not found in the database.`);
        if (user.roles.includes(new ObjectID(rid))) throw new BadRequest("The user is already in that role.");

        const roles = [...user.roles, new ObjectID(rid)];

        const updatedUser = await User.findByIdAndUpdate(uid, { roles }, { new: true });

        return res.status(200).send(new UserDTO(updatedUser));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
