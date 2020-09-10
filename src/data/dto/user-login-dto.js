const UserDTO = require("./user-dto");

class UserLoginDTO extends UserDTO {
    constructor(user, token) {
        super(user);
        this.token = token || null;
    }
}

module.exports = UserLoginDTO;
