'use strict';

const request = require('request');
const AWS     = require('aws-sdk');

const lambdaConfig = {
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION
}

const lambda = new AWS.Lambda();

module.exports.checkInfrastructure = (infrastructure) => {
  const name = process.env.FUNCTION_NAME_PROBE;
  console.log(name);
  return new Promise((resolve, reject) => {
    const params = {
      FunctionName: process.env.FUNCTION_NAME_PROBE,
      InvocationType: 'Event',
      LogType: 'Tail',
      Payload: JSON.stringify(infrastructure)
    }
    console.log(params);
    lambda.invoke(params, (err, data) => {
      if(err) console.log(err, err.stack);
      else console.log(infrastructure['name'] + " checked");
    });
    return resolve('ok');
  });
};