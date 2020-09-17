const express = require("express");
const taskRouter = express.Router();
const {
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    InternalServerError,
} = require("../error-handling/errors");
const { ObjectID } = require("mongodb");
const Task = require("../data/models/task");
const User = require("../data/models/user");
const TaskDTO = require("../data/dto/task-dto");
const UserRoleEnum = require("../enums/user-role-enum");
const TaskUtilities = require("../data/models/utilities/task-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");
const { authWrapper } = require("../middleware/auth");

// Get all tasks
taskRouter.get("/", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const tasks = await Task.find({});

        res.status(200).send(TaskUtilities.transformTasksToDtos(tasks));
    } catch (err) {
        next(err);
    }
});

// Get a single task by ID
taskRouter.get("/:id", authWrapper(UserRoleEnum.ADMIN), async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const task = await Task.findById(id);

            if (!task) throw new NotFound(`A task with an ID of ${id} was not found in the database.`);

            res.status(200).send(new TaskDTO(task));
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Create a new task
taskRouter.post("/", authWrapper(UserRoleEnum.User), async (req, res, next) => {
    try {
        const error = TaskUtilities.validateSaveSchema(req.body);
        const user = req.user;

        if (error) throw new BadRequest(null, null, error);

        const task = new Task(req.body);

        await task.save();

        const tasks = [...user.tasks, new ObjectID(task._id)];

        await User.updateOne({ _id: user._id }, { tasks });

        res.status(201).send(new TaskDTO(task));
    } catch (err) {
        next(err);
    }
});

// Remove a task
taskRouter.delete("/:id", authWrapper(UserRoleEnum.User), async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const task = await Task.findByIdAndDelete(id);

            if (task) {
                res.status(204).send();
            } else {
                throw new NotFound(`A task with an ID of ${id} was not found in the database.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Update a task
taskRouter.patch("/:id", authWrapper(UserRoleEnum.User), async (req, res, next) => {
    try {
        const id = req.params.id;
        let updates = req.body;
        const error = TaskUtilities.validateUpdateSchema(updates);

        if (error) throw new BadRequest(null, null, error);

        if (ObjectID.isValid(id)) {
            const task = await Task.findById(id);

            if (task) {
                const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

                res.status(200).send(new TaskDTO(updatedTask));
            } else {
                throw new NotFound(`A task with an ID of ${id} was not found in the database.`);
            }
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = taskRouter;
