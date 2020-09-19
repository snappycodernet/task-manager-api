require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const fs = require("fs");
const cors = require("cors");

require("./data/mongoose");

const ErrorHandlerDistributor = require("./error-handling/error-handler");

const userRouter = require("./routes/user-router");
const taskRouter = require("./routes/task-router");
const accountRouter = require("./routes/account-router");
const roleRouter = require("./routes/role-router");

const app = express();
const PORT = parseInt(process.env.APP_PORT) || 3000;

app.use((req, res, next) => {
    const maintenanceEnabled = process.env.UNDER_MAINTENANCE === "true";

    if (maintenanceEnabled) return res.status(503).send("Under maintenance.");

    next();
});
app.use(cors());
app.use(express.json());

app.use(morgan("tiny"));
morganBody(app, {
    noColors: true,
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
    skip: (req, res) => res.statusCode < 400,
});

// Enable routers
app.use("/users", userRouter);
app.use("/tasks", taskRouter);
app.use("/account", accountRouter);
app.use("/roles", roleRouter);

// Global error handler
app.use(ErrorHandlerDistributor.getErrorHandler());

app.listen(PORT, () => {
    console.log(`[${new Date()}] Server listening on port ${PORT}...`);
});
