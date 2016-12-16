'use strict';

/**
 * This function is responsible of rpush notification
 * @constructor
 */
function PushNotification() {}

PushNotification.prototype.initApnConnection = function(config, cb) {

  var apnagent = require('apnagent'),
    pfx = require('path').join(__dirname, config.p12File);

  this.agent = new apnagent.Agent();
  // set our credentials 
  this.agent.set('pfx file', pfx);
  this.agent.set('passphrase', config.passPhrase);
  this.agent.enable(config.environment);
  this.agent.connect(function(err) {
    if (err) {
      console.log(err);
    }
    console.log('connected');
    cb();
  });
  this.agent.on('message:error', function(err, msg) {
    console.log('err', err);
  });
};

/**
 * This function send a message to the apn users
 * @this {PushNotification}
 * @param {object} config                      config object
 * @param {Array}  config.devices              array of the devices
 * @param {String} config.p12File              path of the p12 File
 * @param {String} config.passPhrase           pass phrase of the key
 * @param {Object} config.message              message that needs to be send
 * @param {Object} config.message.sender       sender information
 * @param {String} config.message.sender.name  name of the sender
 * @param {String} config.message.message      actual message
 * @param {String} config.environment          set the environment as sandbox or production
 * @param {String} [config.sound]              sound when the notification receive
 * @param {String} [config.badge]              display badge when the notification receive
 */
PushNotification.prototype.sendAPN = function(config, cb) {

  var alert = {
      body: null
    },
    me = this;

  if (config.message.alert) {
    alert.body = config.message.alert;
  } else {
    alert.body = config.message.sender.name ? (config.message.sender.name + ': ' + config.message.message) : (config.message.sender.firstName + ' ' + config.message.sender.lastName + ': ' + config.message.message);
  }

  function send() {
    config.devices.forEach(function(eachDevice) {
      me.agent.createMessage()
        .device(eachDevice)
        .alert(alert)
        .set('message', config.message)
        .badge(config.badge)
        .sound(config.sound)
        .expires(0)
        .send(cb);
    });
  }

  if (!me.agent) {
    me.initApnConnection(config, send);
  } else {
    send();
  }

};

/**
 * This function send a message to the gcm users
 * @this {PushNotification}
 * @param {object} config                     config object
 * @param {String} config.devices             device Id of the gcm user
 * @param {String} config.serverKey           server key of the app
 * @param {String} config.message             message that needs to be send
 * @param {String} [config.retries]           sound when the notification receive
 * @param {String} [config.collapseKey]       display badge when the notification receive
 * @param {String} [config.delayWhileIdle]    sound when the notification receive
 * @param {String} [config.timeToLive]        display badge when the notification receive
 */
PushNotification.prototype.sendGCM = function(config, cb) {
  var gcm = require('push-notify').gcm({
    apiKey: config.serverKey, // server api key
    retries: config.retries
  });

  // Send a notification.
  gcm.send({
    registrationId: config.devices, // device id
    collapseKey: config.collapseKey,
    delayWhileIdle: config.delayWhileIdle,
    timeToLive: config.timeToLive,
    data: config.message
  });
  // gcm.on('transmissionError', console.log);
  gcm.on('transmissionError', cb);
  gcm.on('transmitted', cb);
};

module.exports = new PushNotification();
