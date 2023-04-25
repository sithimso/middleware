const { connectDatabase } = require("./db");
const Account = require("../model/Account");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

module.exports.getAll = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDatabase();

    const userObj = await Account.find();
    return {
      statusCode: 201,
      body: JSON.stringify(userObj),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

module.exports.getOne = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDatabase();

    const userObj = await Account.findById(event.pathParameters.id);
    return {
      statusCode: 201,
      body: JSON.stringify(userObj),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
