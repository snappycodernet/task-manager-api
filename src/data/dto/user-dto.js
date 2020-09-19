const TaskUtilities = require("../models/utilities/task-utilities");
const RoleUtilities = require("../models/utilities/role-utilities");

class UserDTO {
    constructor(user) {
        this.name = user.name || null;
        this.age = user.age || null;
        this.email = user.email || null;
        this.roles = RoleUtilities.transformRolesToDtos(user.roles) || [];
        this.tasks = TaskUtilities.transformTasksToDtos(user.tasks) || [];
    }
}

module.exports = UserDTO;
