class UserDTO {
    constructor(user) {
        this.name = user.name || null;
        this.age = user.age || null;
        this.email = user.email || null;
    }
}

module.exports = UserDTO;
