// const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
// let isConnected;

// module.exports = connectToDatabase = () => {
//   if (isConnected) {
//     return Promise.resolve();
//   }

//   return mongoose
//     .connect(process.env.DB, {
//       useNewUrlParser: true,
//       //useCreateIndex: true,
//       // useFindAndModify: false,
//       useUnifiedTopology: true,
//     })
//     .then((db) => {
//       isConnected = db.connections[0].readyState;
//     });

//   // return mongoose.connect(process.env.DB).then((db) => {
//   //   isConnected = db.connections[0].readyState;
//   // });
// };

const mongoose = require("mongoose");

let conn = null;

exports.connectDatabase = async () => {
  if (conn == null) {
    console.log("Creating new connection to the database....");
    conn = await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 5000,
    });
    return conn;
  }
  console.log(
    "Connection already established, reusing the existing connection"
  );
};
