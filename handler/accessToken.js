const express = require("express");
const serverless = require("serverless-http");
const app = express();
const responseObject = {
  access_token:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InE1UHVEODU1M3MifQ.eyJpc3MiOiJzcmYuYWlzLmNvLnRoL3NjZiIsInN1YiI6InRva2VuX2F1dGhlbnRpY2F0aW9uX2NvZGUiLCJhdWQiOiIxd0VrZDVhelNkMWM1V0lhMmJLa0Z2b2taem56TjNlUyIsImV4cCI6MTU5MjM4NTM0MSwiaWF0IjoxNTkyMzgxNzQxLCJqdGkiOiJvb3prZDI5cmhSVWRhQll6ZDFNSWc4IiwicGlkIjoiNFhja1NJREZQb2Fvb3pTMUhESkhaaWZqQUZpcXlEM3lwNUlLb2d2cVZLST0iLCJjbGllbnQiOiJNakF3TURJc1lXSmpmR2x2YzN3eUxqQXVNQT09Iiwic3NpZCI6IkR1UTQ1M0cyQzZ5c2tBU3JhdnNTcUgiLCJ1aWQiOiIxMjMzNTU0ODQ4NTQ2MzQ4IiwiYXV0Ijp7InR5cGUiOiJtc2lzZG4iLCJhY3Rpb24iOiJsb2dpbiIsImxvZ2luX2NoYW5uZWwiOiJhdXRvIiwibmV0d29yayI6ImFpcyJ9fQ.Lg1XWZr6yc3yinAN64AAXnEX3Wuhs1oZUQRwGPBS8kTnA4ENLxHMNNt_5gK36dFmlNs2ZT4t-31Qofi3r7uRJ8hEWap6nOaH-As8BCz9wM3cE9-W_-03iObbyMVlTBKPX0GvscKxHTmu4Kr7MkZUBFpVGPHtn3qi6ftkxuc7EYQ",
  refresh_token: "H2I8m0voA9n3KIb6l2rk1592381741081DuQ453G2C6yskASravsSqH",
  refresh_token_expires_in: 3600,
  id_token:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InE1UHVEODU1M3MifQ.eyJpc3MiOiJzcmYuYWlzLmNvLnRoL3NjZiIsInN1YiI6ImlkVG9rZW4iLCJhdWQiOiIxd0VrZDVhelNkMWM1V0lhMmJLa0Z2b2taem56TjNlUyIsImV4cCI6MTU5MjM4NTM0MSwiaWF0IjoxNTkyMzgxNzQxLCJqdGkiOiJpelZlOWtIMEdodGQ0WTRsZDBaRjE5IiwiYXV0Ijp7InR5cGUiOiJtc2lzZG4iLCJhY3Rpb24iOiJsb2dpbiIsImxvZ2luX2NoYW5uZWwiOiJhdXRvIiwibmV0d29yayI6ImFpcyJ9LCJub25jZSI6IkFETUQtMjAwNjE3eDl2dTJ4SWs1NzQiLCJpbmZvIjp7InB1YmxpY19pZCI6IjA5OXh4eDQ5NDYiLCJwdWJsaWNfaWRfdHlwZSI6Im1zaXNkbiJ9fQ.mPO-iFvShfUehduox2wcfJsWjtAYqbuhrq9kejuusnNWfTocerJeEwZzleQM5NpdF1ThGy40egUb9WojrmUkpsBTqdmrreZUqN-5-K2bDrsyOSmGZZH-g4UB7Vn_G9RI_HPCF7SyXhhXiX-jmqZVOIc6P1rLJF2bKBXo0m1lq7I",
  token_type: "bearer",
  expires_in: 86400,
};

const data = JSON.stringify(responseObject);
module.exports.token = async (event, context, callback) => {
  console.log(
    "============ Access Token : will return Access Token =========="
  );

  try {
    const response = {
      statusCode: 200,
      //   body: JSON.stringify({
      //   message: "First Response.",
      //   authCodeData: authCode,
      //   allQueryParams,
      // }),
      headers: {
        "x-session-id": "85rfeHmk78NQR5OpEBfAmp",
        "x-rtid": "SRFP-200114YOb0W7WfO5b",
        "x-tid": "SRFP-200114Bdkj11VRNol",
      },
      body: data,
    };
    callback(null, response);
  } catch (err) {
    console.log("Error", err);

    callback(new Error(err));

    return;
  }
};
