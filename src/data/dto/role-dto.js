class RoleDTO {
    constructor(role) {
        this.name = role.name || null;
        this.description = role.description || null;
    }
}

module.exports = RoleDTO;
