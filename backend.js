'use strict';

module.exports.cpuutilizationtrigger = (event, context, callback) => {

  var dayInMilliseconds = 1000 * 60 * 60 * 24;
  var hourInMilliseconds = 1000 * 60 * 60;
  var endTime = new Date();
  var startTime = new Date(endTime.getTime() - hourInMilliseconds);
  var stats = {
    MetricName: 'CPUUtilization',
    Statistics: ['Average', 'Maximum', 'Minimum', 'Sum'],
    Namespace: 'AWS/EC2',
    StartTime: startTime.toISOString(),
    EndTime: endTime.toISOString(),
    Period: 60,
    Unit: 'Percent',
    Dimensions: [{
      "Name": "AutoScalingGroupName",
      "Value": "awseb-e-pi3fzniiyk-stack-AWSEBAutoScalingGroup-1N1OG36O1JEU"
    }]
  };

  const AWS = require('aws-sdk');
  var cloudwatch = new AWS.CloudWatch();

  cloudwatch
    .getMetricStatistics(stats, function (error, result) {
      if (error) {
        console.log(error, error.stack);
      } else {

        const dynamoDBConfig = {
          sessionToken: process.env.AWS_SESSION_TOKEN,
          region: process.env.AWS_REGION
        };
        const documentClient = new AWS.DynamoDB.DocumentClient(dynamoDBConfig);
        const metricsTable = process.env.SERVERLESS_PROJECT + '-metrics-' + process.env.SERVERLESS_STAGE;
        const uuid = require('uuid');
        var metric = {
          id: uuid.v1(),
          name: 'CPUUtilization',
          data: JSON.stringify(result.Datapoints)
        };
        const params = {
          TableName: metricsTable,
          Item: metric
        };
        documentClient.put(params, (error, data) => {
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
      }

    });
};