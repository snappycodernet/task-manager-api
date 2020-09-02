const Task = require("../task");
const UtilitiesShared = require("./utilities-shared");

class TaskUtilities extends UtilitiesShared {
    constructor() {
        super(Task);
    }
}

module.exports = TaskUtilities;
