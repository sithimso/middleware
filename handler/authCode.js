const express = require("express");
const Account = require("../model/Account");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const serverless = require("serverless-http");
const axios = require("axios");
const app = express();
const mongoose = require("mongoose");

const connectDB = () => {
  console.log("============ Test DB Connection ==========");

  const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

  console.log(`DB : ${DB}`);

  return mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports.auth = async (event, context, callback) => {
  try {
    //Connect DB

    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Connecting to DB ....");

    await connectDB();
    console.log(".....Connect Database Successfully....");

    console.log("============= Collect AuthCode ==========");
    const authCode = event.queryStringParameters.code;
    console.log("Auth code : ", authCode);

    console.log("============ Get Access Token ===========");
    // Request Object
    const requestObject = {
      client_id:
        "Gk+9zbMPS9f8B6mE83TNOkCuWUkRMjAxcfXhrLZ7TlFhop0dYRIkQJ3GvIXadN4q7oTPgwM7oUU=",
      client_secret: "e2afa1211b904e72a0bbd5b332d88d03",
      grant_type: "authorization_code",
      redirect_uri: "https://dev-middleware.thssoft.com/authen/",
      code: "n8S4hLBuzAAaqJ6Q1VFdD56YmXMYG7w162tB3lVPsjKn",
    };

    const res = await axios({
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://7nw5rtq5tk.execute-api.ap-southeast-1.amazonaws.com/dev/token/",
      data: requestObject,
    });

    //Collect the parameters to save in DB
    const dataObj = JSON.parse(JSON.stringify(res.data));
    //const hoi = JSON.parse(JSON.stringify(res.headers));

    const newAccount = await Account.create(dataObj);

    const response = {
      statusCode: 200,
      //   body: JSON.stringify({
      //   message: "First Response.",
      //   authCodeData: authCode,
      //   allQueryParams,
      // }),
      // headers: {
      //   "x-session-id": "85rfeHmk78NQR5OpEBfAmp",
      //   "x-rtid": "SRFP-200114YOb0W7WfO5b",
      //   "x-tid": "SRFP-200114Bdkj11VRNol",
      // },
      body: JSON.stringify(newAccount),
    };

    callback(null, response);
  } catch (err) {
    console.log("Error", err);
    callback(new Error(err));
    return;
  }
};

module.exports.queryOne = async (event, context, callback) => {
  try {
    //Connect DB

    const tokenId = event.pathParameters.tokenId;

    context.callbackWaitsForEmptyEventLoop = false;

    await connectDB();
    console.log(".....Connect Database Successfully....");

    // Request Object

    const accountData = await Account.findById(tokenId);

    const response = {
      statusCode: 200,

      body: JSON.stringify(accountData),
    };

    callback(null, response);
  } catch (err) {
    console.log("Error", err);
    callback(new Error(err));
    return;
  }
};

module.exports.queryAll = async (event, context, callback) => {
  try {
    //Connect DB
    console.log("Connecting to DB ....");
    context.callbackWaitsForEmptyEventLoop = false;

    await connectDB();
    console.log(".....Connect Database Successfully....");

    // Request Object

    const accountData = await Account.find();

    const response = {
      statusCode: 200,

      body: JSON.stringify(accountData),
    };

    callback(null, response);
  } catch (err) {
    console.log("Error", err);
    callback(new Error(err));
    return;
  }
};
