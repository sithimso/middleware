const express = require("express");
const Account = require("../model/Account");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const serverless = require("serverless-http");
const axios = require("axios");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

// JWT_SECRET_AWS=MIDDLEWAREJWTSECRETAWS1234567890
// JWT_RFRESH_SECRET_AWS=MIDDLEWAREJWTSECRETAWSREFRESH890
// JWT_EXPIRES_IN_AWS=90
// JWT_REFRESH_EXPIRES_IN_AWS=1y

const signToken = (pid) => {
  return jwt.sign({ pid }, process.env.JWT_SECRET_AWS, {
    expiresIn: process.env.JWT_EXPIRES_IN_AWS,
  });
};

const signreFreshToken = (pid) => {
  return jwt.sign({ pid }, process.env.JWT_RFRESH_SECRET_AWS, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN_AWS,
  });
};

const createResponse = (status, body) => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
};

const connectDB = () => {
  console.log("============ Test DB Connection ==========");
  // Test SSM
  const DBURLAWS = process.env.DBURLAWS;
  console.log(DBURLAWS);

  console.log(`DBURLAWS : ${DBURLAWS}`);

  const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

  console.log(`DB : ${DB}`);
  // Try using DB AWS URL
  return mongoose.connect(DBURLAWS, {
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

    console.log("Connecting to DB  by using AWS URL....");

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

    // console.log("Response Data ", JSON.stringify(res.data));
    // console.log("----------------------------------------------------");
    // console.log(res);
    // console.log("----------------------------------------------------");
    // console.log("Response.status raw ", res.status);

    const result = JSON.stringify(res.status);
    console.log("Response.status ", result);
    if (result === "200") {
      console.log("Result OK");

      let resData = { ...res.data };
      console.log("Response First Data ", JSON.stringify(res.data));
      const decodedObject = jwt.decode(res.data.access_token);
      console.log("Decoded Object", JSON.stringify(decodedObject));
      const privateId2 = JSON.stringify(decodedObject.pid).slice(1, -1);
      resData.pid = privateId2;

      //Genereate MW TOKEN

      const mwToken = signToken(privateId2);
      const mwRefreshToken = signreFreshToken(privateId2);

      // console.log("pid2 : ", privateId2);
      // console.log("Response Data 2nd Time  : ", JSON.stringify(resData));

      // const responseData = res.data;

      //Collect the parameters to save in DB

      // const dataObj = JSON.parse(resData);
      // dataObj.pid = JSON.stringify(decodedObject.pid);
      //const hoi = JSON.parse(JSON.stringify(res.headers));

      const newAccount = await Account.create(resData);
      const response = createResponse(200, {
        newAccount,
        mwToken,
        mwRefreshToken,
      });
      console.log("response ", JSON.stringify(response));
      // const response = {
      //   statusCode: 200,
      //   body: JSON.stringify(newAccount),
      // };

      callback(null, response);
    } else {
      throw new Error((message = "Unkown Error"));
    }
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

module.exports.refreshToken = async (event, context, callback) => {
  let body = JSON.parse(event.body)

  const verify = await jwt.verify(
    body.refreshToken,
    process.env.JWT_RFRESH_SECRET_AWS
  );
  if (!verify) {
    throw new Error((message = "Token invalid"));
  }
  const mwToken = signToken(body.pid);
  const mwRefreshToken = signreFreshToken(body.pid);

  const response = createResponse(200, {
    mwToken,
    mwRefreshToken,
  });
  callback(null, response);
};