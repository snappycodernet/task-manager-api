require("../src/data/mongoose");
const User = require("../src/data/models/user");

// 5f36dca32fdece2aa06d90ab

/*
User.findByIdAndUpdate("5f35c9c893395b1bd456fdc9", { age: 1 })
    .then((user) => {
        console.log(user);

        return User.countDocuments({ age: 1 });
    })
    .then((count) => {
        console.log(count);
    })
    .catch((error) => console.log(error));
*/

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });

    return {
        user,
        count,
    };
};

updateAgeAndCount("5f36dca32fdece2aa06d90ab", 57)
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });
