'use strict';
/**
 * this module handles the mail sending operations and send mail using email js
 * Utility Module
 * @module Sendmail
 * @param  {Object}   req                                          request object
 * @param  {app}      req.app                                      app namespace
 * @param  {Object}   req.app.config                               app configuration object
 * @param  {Object}   req.app.config.smtp                          smtp configuration object
 * @param  {Object}   req.app.config.smtp.credentials              credentail object
 * @param  {String}   req.app.config.smtp.credentials.user         username of the mail server
 * @param  {String}   req.app.config.smtp.credentials.password     pasword of the mail server for the username suuplied
 * @param  {String}   req.app.config.smtp.credentials.host         name of the mail server
 * @param  {Boolean}  req.app.config.smtp.credentials.ssl          pass true if you want to send the email securely
 * @param  {Object}   req.app.locals                               local variables that helps during render
 * 
 * @param  {Object}   res                                          response object
 * @param  {Object}   options                                      options to send email
 * @param  {String}   options.from                                 sender of the format (address or name < address > or "name" < address >)
 * @param  {String}   options.to                                   recipients (same format as above), multiple recipients are separated by a comma
 * @param  {String}   options.cc                                   carbon copied recipients (same format as above)
 * @param  {String}   options.bcc                                  blind carbon copied recipients (same format as above)
 * @param  {String}   options.subject                              string subject of the email
 * @param  {String}   options.textPath                             path of the text mail template
 * @param  {String}   options.text                                 text of the mail. ignored if textpath is defined
 * @param  {String}   options.htmlPath                             path of the html mail template
 * @param  {String}   options.html                                 html content of the mail. ignored if htmlpath is defined
 * @param  {Object}   options.locals                               local variable that you want to pass in the template and that is not present inside app.locals
 * @param  {Function} options.success                              if the email send is successfull this callback is executed
 * @param  {Function} options.errors                               if the email send is not successfull this callback is executed
 * @return {Boolean}                                               if the email send is successfull then options.success callback will get true as response
 * @return {Error}                                                 if the email send is not successfull then options.errors callback will get the generated error as response
 * 
 */
function sendmail(req, res, options) {

  options.locals = require('underscore').extend(req.app.locals, options.locals);

  /**
   * this funcction renders the text by using express res.render method 
   * @param  {requestCallback} callback callback that needs to executed
   * @return {Error}                    if any error occured during the rendering 
   * @return {String}                   if no error occured during the rendering then send 'done'
   *
   * @function renderText
   * @memberOf module:Sendmail
   * 
   */
  var renderText = function(callback) {
      req.app.render(options.textPath, options.locals, function(err, text) {
        if (err) {
          callback(err, null);
        } else {
          options.text = text;
          return callback(null, 'done');
        }
      });
    },
    /**
     * this funcction renders the html by using express res.render method 
     * @param  {requestCallback} callback callback that needs to executed
     * @return {Error}                    if any error occured during the rendering 
     * @return {String}                   if no error occured during the rendering then send 'done'
     *
     * @function renderText
     * @memberOf module:Sendmail
     */
    renderHtml = function(callback) {
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
      if (err) {
        options.error(err);
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

      var emailer = require('emailjs/email')
        .server.connect(req.app.config.smtp.credentials);
      emailer.send({
        from: options.from,
        to: options.to,
        'reply-to': options.replyTo || options.from,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        attachment: attachments
      }, function(err) {
        req.app.utility.printData(err, options.to);
        if (err) {
          return options.error(err);
        } else {
          return options.success(true);
        }
      });
    }
  );
}

module.exports = sendmail;
