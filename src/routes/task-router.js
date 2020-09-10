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
const TaskDTO = require("../data/dto/task-dto");
const TaskUtilities = require("../data/models/utilities/task-utilities");
const MongooseUtilities = require("../utilities/mongoose-utils");

// Get all tasks
taskRouter.get("/", async (req, res, next) => {
    try {
        const tasks = await Task.find({});

        res.status(200).send(TaskUtilities.transformTasksToDtos(tasks));
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

            res.status(200).send(new TaskDTO(task));
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

        res.status(201).send(new TaskDTO(task));
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
