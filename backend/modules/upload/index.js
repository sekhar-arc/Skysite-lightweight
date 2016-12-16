'use strict';

var require, module;

module.exports = function(app) {

  var router = require('express').Router(),
    controller = require('./controller');

  //without session
  router.post('/external-upload', controller.authenticate, controller.getUploadSessionId, controller.externalUpload);
  router.post('/direct-upload', controller.directUpload);


  return router;

};
