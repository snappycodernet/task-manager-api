const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number.");
            }
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Email is invalid.");
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) return user;
    }

    return null;
};

userSchema.methods.loadDynamics = async function () {
    await this.populate("tasks").execPopulate();
    await this.populate("roles").execPopulate();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
