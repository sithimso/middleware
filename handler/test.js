const querystring = require("querystring");
const superagent = require("superagent");
const axios = require("axios");

const createResponse = (status, body) => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
};

module.exports.test = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  console.log("Hello");

  const baseUrl = "https://iot-auth-aisplay.ais.th/auth/v3.2/oauth/authorize?";

  const encodedQuery = querystring.stringify({
    response_type: "code",

    client_id: "W8z7Yof0Sm35UrFoQm0pxHH14ay2e05RfU4EHfrLvfI",

    redirect_uri: "https://aisplay.ais.co.th/portal/",

    scope: "profile",

    state: "sdelkr239411",
  });

  const url = baseUrl + encodedQuery;

  const response = await superagent.get(url).set("x-msisdn", "66988304040");
  console.log(response);
  const urls = response.redirects.pop();
  console.log(urls);

  const regex = /code=([^&]*)/;
  const match = regex.exec(urls);
  let code;
  if (match) {
    code = match[1];
    console.log("--------------------------------");
    console.log(code);
  } else {
    code = "error";
  }

  // const res_wow = await superagent
  //   .get(url)
  //   .set("x-msisdn", "66988304040")
  //   .redirects(0)
  //   .pipe(res);

  // .end();
  // .end((err, res) => {
  //   console.log(res);
  //   //   res.headers["location"];
  // });

  // const code = res_wow.headers["location"];
  //  console.log(res_wow);
  const response_final = createResponse(200, { authCode: code });
  console.log(response_final);
  callback(null, response_final);
};

// module.exports.test = async (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const options = {
//     method: "GET",

//     url: "https://iot-auth-aisplay.ais.th/auth/v3.2/oauth/authorize?response_type=code&client_id=W8z7Yof0Sm35UrFoQm0pxHH14ay2e05RfU4EHfrLvfI%3D&redirect_uri=https%3A%2F%2Faisplay.ais.co.th%2Fportal%2F&scope=profile&state=sdelkr239411",

//     headers: {
//       "x-msisdn": "66988304040",
//     },

//     maxRedirects: 0, // Disable automatic redirect following
//   };

//   const response = await axios(options);

//   console.log(response);

//   const regex = /code=([^&]*)/;

//   const match = regex.exec(response.headers.location);

//   let code;
//   if (match) {
//     code = match[1];

//     console.log(code);
//   } else {
//     code = "not yet get code";
//   }

//   // const code = res_wow.headers["location"];
//   //  console.log(res_wow);
//   const response_final = createResponse(200, { authCode: code });
//   console.log(response_final);
//   callback(null, response_final);
// };
