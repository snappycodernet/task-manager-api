const Joi = require("joi");

const saveTaskValidationSchema = Joi.object({
    description: Joi.string().min(6).max(255).required(),
    completed: Joi.boolean(),
});

const updateTaskValidationSchema = Joi.object({
    description: Joi.string().min(6).max(255),
    completed: Joi.boolean(),
});

module.exports = {
    saveTaskValidationSchema,
    updateTaskValidationSchema,
};
