'use strict';

var config = JSON.parse(require('fs').readFileSync('credentials/aws.json')),
  aws = require('aws-sdk'),
  Q = require('q'),
  sqs;

var sqs = new aws.SQS({
  region: config.region,
  accessKeyId: config.accessID,
  secretAccessKey: config.secretKey,
  params: {
    QueueUrl: config.partnerUpdate.url
  }
});

module.exports = {
  receiveMessage: Q.nbind(sqs.receiveMessage, sqs),
  deleteMessage: Q.nbind(sqs.deleteMessage, sqs),
  sendMessage: Q.nbind(sqs.sendMessage, sqs),
};
