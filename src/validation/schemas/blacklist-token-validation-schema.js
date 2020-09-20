const Joi = require("joi");

const saveBlacklistTokenValidationSchema = Joi.object({
    token: Joi.string().required(),
    reason: Joi.string().max(255),
});

const updateBlacklistTokenValidationSchema = Joi.object({
    token: Joi.string().required(),
    reason: Joi.string().max(255),
});

module.exports = {
    saveBlacklistTokenValidationSchema,
    updateBlacklistTokenValidationSchema,
};
