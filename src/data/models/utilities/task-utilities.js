const Task = require("../task");
const TaskDTO = require("../../dto/task-dto");
const UtilitiesShared = require("./utilities-shared");
const {
    saveTaskValidationSchema,
    updateTaskValidationSchema,
} = require("../../../validation/schemas/task-validation-schema");

class TaskUtilities extends UtilitiesShared {
    constructor() {
        super(Task);
    }

    static validateSaveSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = saveTaskValidationSchema.validate(data);

        return error;
    }

    static validateUpdateSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = updateTaskValidationSchema.validate(data);

        return error;
    }

    static transformTasksToDtos(taskArray) {
        if (!taskArray || taskArray.length === 0) return [];
        const taskDtoArray = [];

        for (var i = 0; i < taskArray.length; i++) {
            taskDtoArray.push(new TaskDTO(taskArray[i]));
        }

        return taskDtoArray;
    }
}

module.exports = TaskUtilities;
