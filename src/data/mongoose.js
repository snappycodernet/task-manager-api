const mongoose = require("mongoose");
const connectionURL = process.env.DB_TASKMANAGER_CONNECTION;

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
