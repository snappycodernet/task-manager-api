const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = process.env.MONGODB_LOCALDB_STR;
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log(`Unable to connect to database! Reason: ${error.message}`);
    }

    const db = client.db(databaseName);

    /*
    db.collection("users")
      .insertOne({
        name: "Price",
        age: 32,
      })
      .then((result) => console.log(result.ops))
      .catch((error) => console.log(error));
      */

    /*
    db.collection("users")
      .deleteMany({ age: { $gt: 30 } })
      .then((result) => console.log(result.deletedCount))
      .catch((error) => console.log(error));
      */
  }
);
