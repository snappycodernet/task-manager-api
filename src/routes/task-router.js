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
const TaskUtilities = require("../data/models/utilities/task-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");

// Get all tasks
taskRouter.get("/", async (req, res, next) => {
    try {
        const tasks = await Task.find({});

        res.status(200).send(tasks);
    } catch (err) {
        next(err);
    }
});

// Get a single task by ID
taskRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;

        if (ObjectID.isValid(id)) {
            const task = await Task.findById(id);

            if (!task) throw new NotFound(`A task with an ID of ${id} was not found in the database.`);

            res.status(200).send(task);
        } else {
            throw new BadRequest(`Must enter a valid ID value. The value entered, ${id}, is not valid.`);
        }
    } catch (err) {
        next(err);
    }
});

// Create a new task
taskRouter.post("/", async (req, res, next) => {
    try {
        const task = new Task(req.body);

        await task.save();

        res.status(201).send(task);
    } catch (err) {
        next(err);
    }
});

// Remove a task
taskRouter.delete("/:id", async (req, res, next) => {
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
taskRouter.patch("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const taskUtil = new TaskUtilities();
        const results = taskUtil.validateSchema(updates);

        if (!results.success) {
            throw new BadRequest(
                `The updates provided contained fields that do not exist on the model schema: ${results.invalidFields.join(
                    ","
                )}.`
            );
        }

        if (ObjectID.isValid(id)) {
            const task = await Task.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
            }).catch((err) => {
                if (MongooseUtilities.isMongooseError(err)) {
                    throw new BadRequest(err.message, err.name);
                }

                throw err;
            });

            if (task) {
                res.status(200).send(task);
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
