'use strict';

module.exports.cpuutilization = (event, context, callback) => {

  const dynamoDBConfig = {
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
  };
  const AWS = require('aws-sdk');
  const documentClient = new AWS.DynamoDB.DocumentClient(dynamoDBConfig);
  const metricsTable = process.env.SERVERLESS_PROJECT + '-metrics-' + process.env.SERVERLESS_STAGE;

  const params = {
    TableName: metricsTable,
    AttributesToGet: [
      'id',
      'name',
      'data'
    ]
  };
  documentClient.scan(params, (error, data) => {
    const res = {
      "statusCode": 200,
      "headers": {},
      "body": "" // body must be returned as a string
    };
    if (error) {
      res.body = JSON.stringify(error);
    } else {
      res.body = JSON.stringify(data["Items"]);
    }
    context.succeed(res);
  });
};