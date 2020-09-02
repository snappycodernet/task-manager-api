class UtilitiesShared {
    constructor(model) {
        this.model = model;
    }

    validateSchema(data) {
        const schema = Object.keys(this.model.schema.obj);
        const dataFields = Object.keys(data);
        const invalidFields = [];

        for (let field of dataFields) {
            if (!schema.includes(field)) {
                invalidFields.push(field);
            }
        }

        return {
            invalidFields,
            success: invalidFields.length === 0,
        };
    }
}

module.exports = UtilitiesShared;
