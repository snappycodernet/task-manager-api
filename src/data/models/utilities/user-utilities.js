const User = require("../user");
const UtilitiesShared = require("./utilities-shared");
const bcrypt = require("bcryptjs");
const {
    saveUserValidationSchema,
    updateUserValidationSchema,
    credentialUserValidationSchema,
} = require("../../../validation/schemas/user-validation-schema");
const UserDTO = require("../../dto/user-dto");

class UserUtilities extends UtilitiesShared {
    constructor() {
        super(User);
    }

    static validateSaveSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = saveUserValidationSchema.validate(data);

        return error;
    }

    static validateUpdateSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = updateUserValidationSchema.validate(data);

        return error;
    }

    static validateCredentialSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = credentialUserValidationSchema.validate(data);

        return error;
    }

    static async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.APP_HASH_ROUNDS));

        return hashedPassword;
    }

    static async unHashedPasswordMatchesHashed(unHashedPassword, hashedPassword) {
        const isSame = await bcrypt.compare(unHashedPassword, hashedPassword);

        return isSame;
    }

    static transformUsersToDtos(userArray) {
        if (!userArray || userArray.length === 0) return [];
        const userDtoArray = [];

        for (var i = 0; i < userArray.length; i++) {
            userDtoArray.push(new UserDTO(userArray[i]));
        }

        return userDtoArray;
    }

    static async loadDynamics(userArray) {
        if (!userArray || userArray.length === 0) return;

        for (let user of userArray) {
            await user.populate("tasks").execPopulate();
            await user.populate("roles").execPopulate();
        }
    }
}

module.exports = UserUtilities;
