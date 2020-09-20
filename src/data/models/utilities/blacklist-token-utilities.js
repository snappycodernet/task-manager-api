const BlacklistToken = require("../blacklist-token");
const BlacklistTokenDTO = require("../../dto/blacklist-token-dto");
const UtilitiesShared = require("./utilities-shared");
const {
    saveBlacklistTokenValidationSchema,
    updateBlacklistTokenValidationSchema,
} = require("../../../validation/schemas/blacklist-token-validation-schema");

class BlacklistTokenUtilities extends UtilitiesShared {
    constructor() {
        super(BlacklistToken);
    }

    static validateSaveSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = saveBlacklistTokenValidationSchema.validate(data);

        return error;
    }

    static validateUpdateSchema(data) {
        if (!data) {
            return new Error("The provided schema was null, undefined or empty.");
        }

        const { error, value } = updateBlacklistTokenValidationSchema.validate(data);

        return error;
    }

    static transformBlacklistTokensToDtos(blacklistTokenArray) {
        if (!blacklistTokenArray || blacklistTokenArray.length === 0) return [];
        const blacklistTokenDtoArray = [];

        for (var i = 0; i < blacklistTokenArray.length; i++) {
            blacklistTokenDtoArray.push(new BlacklistTokenDTO(blacklistTokenArray[i]));
        }

        return blacklistTokenDtoArray;
    }
}

module.exports = BlacklistTokenUtilities;
