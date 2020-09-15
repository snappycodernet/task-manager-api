const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    description: {
        type: String,
        maxlength: 255,
        trim: true,
    },
});

function removeLinkedUserRoles(role) {
    User.find({ "roles._id": role._id }, function (err, users) {
        if (err) {
            console.log(err);
        } else {
            for (let user of users) {
                user.roles = user.roles.filter((r) => r._id != role._id);
                User.updateOne({ _id: user._id }, user);
            }
        }
    });
}

roleSchema.post("remove", removeLinkedUserRoles);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
