class RoleDTO {
    constructor(role) {
        this.id = role._id;
        this.name = role.name || null;
        this.description = role.description || null;
    }
}

module.exports = RoleDTO;
