'use strict';

const dynamoDB = require('./lib/dynamo');
//const lambda = require('./lib/lambda');

module.exports.dashboard = (event, context, callback) => {
  const fs = require('fs');
  const ejs = require('ejs');

  dynamoDB
    .getInfrastructure()
    .then((infrastructure) => {
      const htmlpath = fs.readFileSync('./web/index.html', 'UTF-8');
      const html = ejs.render(htmlpath, {
        infrastructure: infrastructure
      });

      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
          "Access-Control-Allow-Origin": "*"
        },
        body: html
      };
      callback(null, response);
    });
};