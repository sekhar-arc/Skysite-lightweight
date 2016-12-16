'use strict';
/**
 * Utility Module
 * @module Sendmail
 */
module.exports = function(req, res, options, cb) {


  var aws = require('aws-sdk');
  aws.config.update({
    "accessKeyId": "AKIAJ4A37O7WTFGOE5HA",
    "secretAccessKey": "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",
    "region": "us-west-2"
  });
  var ses = new aws.SES({
    apiVersion: '2010-12-01'
  });


  var renderText = function(callback) {
    req.app.render(options.textPath, options.locals, function(err, text) {
      if (err) {
        callback(err, null);
      } else {
        options.text = text;
        return callback(null, 'done');
      }
    });
  };

  var renderHtml = function(callback) {
    req.app.render(options.htmlPath, options.locals, function(err, html) {
      if (err) {
        callback(err, null);
      } else {
        options.html = html;
        return callback(null, 'done');
      }
    });
  };


  var renderers = [];
  if (options.textPath) {
    renderers.push(renderText);
  }

  if (options.htmlPath) {
    renderers.push(renderHtml);
  }

  require('async').parallel(
    renderers,
    function(err) {
      // // console.log(err);

      if (err) {
        options.error('Email template render failed. ' + err);
        return;
      }

      var attachments = [];

      if (options.html) {
        attachments.push({
          data: options.html,
          alternative: true
        });
      }

      if (options.attachments) {
        for (var i = 0; i < options.attachments.length; i++) {
          attachments.push(options.attachments[i]);
        }
      }
      //for ses commented
      console.log('email: ', options.to);

      ses.sendEmail({
        Source: 'Kevinhart <zay@supercoil.tech>',
        Destination: {
          ToAddresses: [options.to]
        },
        Message: {
          Subject: {
            Data: options.subject
          },
          Body: {
            Html: {
              Data: options.html
            }
          }
        }
      }, function(err, data) {
        if (err) {
          console.log(err);
          return cb(err);
        } else {
          return cb(null, data);
        }
      });
    }
  );
}
