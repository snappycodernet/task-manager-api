class TaskDTO {
    constructor(task) {
        this.description = task.description || null;
        this.completed = task.completed || null;
    }
}

module.exports = TaskDTO;
