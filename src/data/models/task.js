const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 255,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

function removeTaskFromUser(task) {
    User.find({ "tasks._id": task._id }, function (err, users) {
        if (err) {
            console.log(err);
        } else {
            for (let user of users) {
                user.tasks = user.tasks.filter((r) => r._id != task._id);
                User.updateOne({ _id: user._id }, user);
            }
        }
    });
}

taskSchema.post("remove", removeTaskFromUser);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
