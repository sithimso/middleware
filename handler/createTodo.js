const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

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

module.exports.createTodo = async (event, context, callback) => {
  console.log("event", event);

  console.log("context", context);

  const timestamp = new Date().getTime();

  const data = JSON.parse(event.body);

  console.log("data", data);

  try {
    console.log("typeof", typeof data.todo);

    if (typeof data.todo !== "string") {
      const reponse = {
        statusCode: 400,

        body: JSON.stringify({ message: "Invalid" }),
      };

      console.error("Validation Failed");

      callback(null, reponse);

      return;
    }

    const params = {
      TableName: USERS_TABLE,

      Item: {
        userId: uuid.v1(),

        todo: data.todo,

        checked: false,

        createdAt: timestamp,

        updatedAt: timestamp,
      },
    };

    try {
      const newobject = await dynamoDbClient.send(new PutCommand(params));
      //const newobject = await dynamoDbClient.send(new PutItemCommand(params));
      //putItem

      console.log(params.Item);

      const reponse = {
        statusCode: 200,

        body: JSON.stringify(newobject),
      };

      callback(null, reponse);
    } catch (err) {
      console.error(err);

      const reponse = {
        statusCode: 500,

        body: JSON.stringify({ message: err.name }),
      };

      callback(null, reponse);

      return;
    }
  } catch (err) {
    const reponse = {
      statusCode: 500,

      body: JSON.stringify({ message: err.name }),
    };

    callback(null, reponse);

    return;
  }
};
