require("../src/data/mongoose");
const Task = require("../src/data/models/task");

// 5f36e1393a2835390c88b7d2

/*
Task.findByIdAndDelete("5f36e1393a2835390c88b7d2")
    .then((task) => {
        console.log(task);

        return Task.countDocuments({ completed: false });
    })
    .then((count) => {
        console.log(count);
    })
    .catch((error) => console.log(error));
*/

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });

    return {
        task,
        count,
    };
};

deleteTaskAndCount("5f36e1393a2835390c88b7d")
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
