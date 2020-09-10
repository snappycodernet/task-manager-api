const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const passwordComplexityOptions = {
    min: 7,
    max: 1024,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

const saveUserValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    age: Joi.number().integer().min(0),
    email: Joi.string().email().required(),
    password: passwordComplexity(passwordComplexityOptions),
});

const updateUserValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    age: Joi.number().integer().min(0),
    email: Joi.string().email(),
    password: passwordComplexity(passwordComplexityOptions),
});

const credentialUserValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    saveUserValidationSchema,
    updateUserValidationSchema,
    credentialUserValidationSchema,
};
