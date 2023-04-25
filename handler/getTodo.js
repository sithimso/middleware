const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,

  GetCommand,

  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");

const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;

const client = new DynamoDBClient();

const dynamoDbClient = DynamoDBDocumentClient.from(client);

const uuid = require("uuid");

module.exports.get = async (event, context, callback) => {
  console.log("event", event);

  console.log("context", context);

  console.log("event.pathParameters", event.pathParameters);

  const params = {
    TableName: USERS_TABLE,

    Key: {
      userId: event.pathParameters.userId,
    },
  };

  try {
    const data = await dynamoDbClient.send(new GetCommand(params));

    const response = data.Item
      ? {
          statusCode: 200,

          body: JSON.stringify(data.Item),
        }
      : {
          statusCode: 404,

          body: JSON.stringify({ message: "Todo not found" }),
        };

    callback(null, response);
  } catch (err) {
    console.log("Error", err);

    callback(new Error(err));

    return;
  }
};

module.exports.get = async (event, context, callback) => {
  console.log("event", event);

  console.log("context", context);

  console.log("event.pathParameters", event.pathParameters);

  const params = {
    TableName: USERS_TABLE,

    Key: {
      userId: event.pathParameters.userId,
    },
  };

  try {
    const data = await dynamoDbClient.send(new GetCommand(params));

    const response = data.Item
      ? {
          statusCode: 200,

          body: JSON.stringify(data.Item),
        }
      : {
          statusCode: 404,

          body: JSON.stringify({ message: "Todo not found" }),
        };

    callback(null, response);
  } catch (err) {
    console.log("Error", err);

    callback(new Error(err));

    return;
  }
};
