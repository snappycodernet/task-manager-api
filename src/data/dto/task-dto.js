class TaskDTO {
    constructor(task) {
        this.id = task._id;
        this.description = task.description || null;
        this.completed = task.completed === undefined || task.completed === null ? null : task.completed;
    }
}

module.exports = TaskDTO;
