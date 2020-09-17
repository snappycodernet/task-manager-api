class ProfileDTO {
    constructor(userDTO, taskDTOs) {
        this.user = userDTO;
        this.tasks = taskDTOs;
    }
}

module.exports = ProfileDTO;
