'use strict';

var require, module;

module.exports = function(app) {

  var router = require('express').Router(),
    controller = require('./controller');

  //without session
  router.get('/check-login/:PWUserId', controller.checkLogin);
  router.get('/get-master-template', controller.getMasterTemplates);
  router.post('/add-custom-template', controller.addCustomTemplate);
  router.post('/change-custom-template', controller.editCustomTemplate);

  router.use('/upload', require('../upload')(app));
  return router;

};
