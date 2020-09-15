const Role = require("../role");
const RoleDTO = require("../../dto/role-dto");
const UtilitiesShared = require("./utilities-shared");
const {
    saveRoleValidationSchema,
    updateRoleValidationSchema,
} = require("../../../validation/schemas/role-validation-schema");

class RoleUtilities extends UtilitiesShared {
    constructor() {
        super(Role);
    }

    static validateSaveSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = saveRoleValidationSchema.validate(data);

        return error;
    }

    static validateUpdateSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = updateRoleValidationSchema.validate(data);

        return error;
    }

    static transformRolesToDtos(roleArray) {
        if (!roleArray || roleArray.length === 0) return [];
        const roleDtoArray = [];

        for (var i = 0; i < roleArray.length; i++) {
            roleDtoArray.push(new RoleDTO(roleArray[i]));
        }

        return roleDtoArray;
    }
}

module.exports = RoleUtilities;
