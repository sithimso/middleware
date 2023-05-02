const mongoose = require("mongoose");

let conn = null;

// const uri = 'mongodb+srv://sls-mongo-example:lEmP9NJtFaMs5IhC@sls-mongo-example.ixcs3at.mongodb.net/?retryWrites=true&w=majority';

const uri = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

exports.connect = async function () {
  let statusconnect = "Create new  Connection";
  if (conn == null) {
    console.log("Create new  Connection");

    conn = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn.asPromise();
  } else {
    console.log("Use old  Connection");
    statusconnect = "Use old  Connection";
  }

  return conn;
};
