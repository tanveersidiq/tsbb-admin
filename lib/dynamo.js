'use strict';

const AWS  = require('aws-sdk');
const uuid = require('uuid');

const dynamoDBConfig = {
  sessionToken:    process.env.AWS_SESSION_TOKEN,
  region:          process.env.AWS_REGION
};

const documentClient = new AWS.DynamoDB.DocumentClient(dynamoDBConfig);
const infrastructureLogs = process.env.SERVERLESS_PROJECT + '-' + process.env.SERVERLESS_STAGE;

module.exports.getInfrastructure = () => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: infrastructureLogs,
      AttributesToGet: [
        'id',
        'name'
      ]
    };
    documentClient.scan(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(data["Items"]);
    });
  });
};
