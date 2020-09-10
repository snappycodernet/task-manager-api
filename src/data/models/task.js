const mongoose = require("mongoose");
const validator = require("validator");

const Task = mongoose.model("Task", {
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

module.exports = Task;
