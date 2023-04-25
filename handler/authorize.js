const express = require("express");
const Account = require("../model/Account");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const serverless = require("serverless-http");
const axios = require("axios");
const app = express();
const mongoose = require("mongoose");

const createResponse = (status, body) => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
};

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
    if (!authCode) {
      throw new Error((message = "Auth code cannot be empty"));
    }

    console.log("============ Get Access Token ===========");
    // Request Object
    const requestObject = {
      client_id:
        "Gk+9zbMPS9f8B6mE83TNOkCuWUkRMjAxcfXhrLZ7TlFhop0dYRIkQJ3GvIXadN4q7oTPgwM7oUU=",
      client_secret: "e2afa1211b904e72a0bbd5b332d88d03",
      grant_type: "authorization_code",
      redirect_uri: "https://dev-middleware.thssoft.com/authen/",
      code: authCode,
    };

    const res = await axios({
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://iot-auth-aisplay.ais.th/auth/v3.2/oauth/token",
      data: requestObject,
    });

    const resData = JSON.stringify(res.data);

    console.log(resData);
    //Collect the parameters to save in DB

    const dataObj = JSON.parse(resData);
    //const hoi = JSON.parse(JSON.stringify(res.headers));

    const newAccount = await Account.create(dataObj);

    const response = {
      statusCode: 200,
      body: JSON.stringify(newAccount),
    };

    callback(null, response);
  } catch (err) {
    let responseError;
    if (err.name === "AxiosError") {
      console.log("================ AxiosError ===========");
      // console.log("Error", err);
      // console.log("err.name", err.name);
      // console.log("err.status", err.status);
      // console.log("err.response", err.response);
      // console.log("err.response.status", err.response.status);
      // console.log("err.response.statusText", err.response.statusText);
      // console.log("err.response.data", err.response.data);

      responseError = {
        statusCode: err.response.status,
        body: JSON.stringify(err.response.data),
      };

      console.log("Error : ", responseError);

      callback(null, responseError);
      return;
    } else {
      console.log("================ General Error ===========");
      console.log("General Error : ", err);
      console.log("Error.name : ", err.name);
      console.log("Error.message : ", err.message);

      responseError = {
        statusCode: 500,
        body: JSON.stringify(err.message),
      };
      console.log("================Error end===================");
      callback(null, responseError);
      return;
    }
  }
};

module.exports.getOneToken = async (event, context, callback) => {
  try {
    //Connect DB
    const tokenId = event.pathParameters.id;
    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Connecting to DB ....");

    await connectDB();
    console.log("Connect Database Successfully....");
    console.log("tokenId ", tokenId);

    const accountData = await Account.findById(tokenId);
    const response = createResponse(200, accountData);
    callback(null, response);
  } catch (err) {
    console.log("================ General Error ===========");
    console.log("General Error : ", err);
    console.log("Error.name : ", err.name);
    console.log("Error.message : ", err.message);

    const responseError = createResponse(500, err.message);

    console.log("================Error end===================");
    callback(null, responseError);
    return;
  }
};

module.exports.getAllToken = async (event, context, callback) => {
  try {
    //Connect DB
    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Get All Token....");
    console.log("Connecting to DB ....");

    await connectDB();
    console.log("Connect Database Successfully....");

    const accountData = await Account.find();
    const response = createResponse(200, accountData);
    callback(null, response);
  } catch (err) {
    console.log("================ General Error ===========");
    console.log("General Error : ", err);
    console.log("Error.name : ", err.name);
    console.log("Error.message : ", err.message);

    const responseError = createResponse(500, err.message);

    console.log("================Error end===================");
    callback(null, responseError);
    return;
  }
};
