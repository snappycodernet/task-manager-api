const Joi = require("joi");

const saveRoleValidationSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(255),
});

const updateRoleValidationSchema = Joi.object({
    name: Joi.string().min(2).max(255),
    description: Joi.string().max(255),
});

module.exports = {
    saveRoleValidationSchema,
    updateRoleValidationSchema,
};
