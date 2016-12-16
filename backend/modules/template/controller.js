'use strict';

var dataModeler = require('./dataModeler');




// exports.handleSession = function(req, res, next) {

//   var sessionObject = {};
//   sessionObject.userId = req.body.userId;
//   sessionObject.token = req.app.utility.generateUniqKey();;
//   req.session.user = sessionObject;

//   req.workflow.emit('response');


// };

/**
 * Represents a function that will check the first time user.
 * @param {Object} req - Requset object
 * @param {Object} res - Response object
 * @param {function} next executable function
 * @param {Object} req.app - app should be a namespace
 * @param {Object} req.workflow - It should be an instance of workflow
 */

exports.checkLogin = function(req, res, next) {
  if (!req.params.PWUserId) {
    req.workflow.outcome.errfor.PWUserId = req.app.utility.message.REQUIRED('PWUserId');
    req.workflow.outcome.messege = req.app.utility.message.REQUIRED('PWUserId');
    return req.workflow.emit('response');
  }
  var templateConfig,
    option = {
      sql: "select * from AC_UserCustomTemplate  LEFT JOIN MI_DefaultTemplate ON AC_UserCustomTemplate.DefaultTemplateID = MI_DefaultTemplate.TemplateId where AC_UserCustomTemplate.PWUserId = ?",
      nestTables: "_"
    };


  req.app.db.query(option, [req.params.PWUserId], function(err, data) {
    if (err) {
      return next(err);
    } else {
      if (data.length === 0) {
        req.workflow.outcome.message = "New User found";
        req.workflow.outcome.data = {
          firstTimeLogin: true
        }
        req.workflow.emit('response');
      } else {
        templateConfig = JSON.parse(data[0].AC_UserCustomTemplate_TemplateConfig || data[0].MI_DefaultTemplate_TemplateConfig);

        req.workflow.outcome.data = {};
        req.workflow.outcome.data.templateConfig = templateConfig;
        req.workflow.emit('response');
      }
    }

  });
}


/**
 * Represents a function to get masterTemplate List.
 * @param {Object} req - Requset object
 * @param {Object} res - Response object
 * @param {function} next executable function
 * @param {Object} req.app - app should be a namespace
 * @param {Object} req.workflow - It should be an instance of workflow
 */

exports.getMasterTemplates = function(req, res, next) {
  req.app.db.query('Select TemplateId,TemplateName,TemplateImage,TemplateConfig from MI_DefaultTemplate Where isActive=1', function(err, data) {
    if (err) {
      return next(err);
    } else {
      if (data.length === 0) {
        req.workflow.outcome.message = "No Master Template Found";
        return req.workflow.emit('response');
      } else {
        req.workflow.outcome.data = {};
        req.workflow.outcome.data.masterTemplates = data;
        req.workflow.emit('response');
      }
    }

  });
}


/**
 * Represents a function to add new custom template.
 * @param {Object} req - Requset object
 * @param {Object} res - Response object
 * @param {function} next executable function
 * @param {Object} req.app - app should be a namespace
 * @param {Object} req.workflow - It should be an instance of workflow
 */

exports.addCustomTemplate = function(req, res, next) {
  var newTemplate = {};
  if (req.body.copyMaster) {

    newTemplate = {
      PWUserId: req.body.PWUserId,
      CreateBy: req.body.PWUserId,
      DefaultTemplateID: req.body.defaultTemplateId,
      CreateDate: new Date()
    }
  }
  if (!req.body.copyMaster) {
    if (!req.body.templateConfig) {
      req.workflow.outcome.errfor.templateConfig = req.app.utility.message.REQUIRED('templateConfig');
      req.workflow.outcome.messege = req.app.utility.message.REQUIRED('templateConfig');
      return req.workflow.emit('response');
    } else {

      newTemplate = {
        PWUserId: req.body.PWUserId,
        CreateBy: req.body.PWUserId,
        TemplateConfig: JSON.stringify(req.body.templateConfig),
        CreateDate: new Date()
      }
    }
  }
  req.app.db.query('INSERT INTO AC_UserCustomTemplate SET ?', newTemplate, function(err, data) {
    if (err) {
      return next(err);
    } else {

      req.workflow.outcome.data = {};
      req.workflow.outcome.message = "Your template has been successfully saved";
      req.workflow.emit('response');

    }
  });
}

/**
 * Represents a function to change custom template config.
 * @param {Object} req - Requset object
 * @param {Object} res - Response object
 * @param {function} next executable function
 * @param {Object} req.app - app should be a namespace
 * @param {Object} req.workflow - It should be an instance of workflow
 */

exports.editCustomTemplate = function(req, res, next) {

  var updateQuery, updateParams = [];
  if (req.body.copyMaster) {
    updateQuery = 'UPDATE AC_UserCustomTemplate SET DefaultTemplateID = ?, ModifyBy = ?, ModifyDate = ? WHERE PWUserId = ?';
    updateParams = [req.body.defaultTemplateId, req.body.PWUserId, new Date(), req.body.PWUserId];
  }
  if (!req.body.copyMaster) {
    if (!req.body.templateConfig) {
      req.workflow.outcome.errfor.templateConfig = req.app.utility.message.REQUIRED('templateConfig');
      req.workflow.outcome.messege = req.app.utility.message.REQUIRED('templateConfig');
      return req.workflow.emit('response');
    } else {

      updateQuery = 'UPDATE AC_UserCustomTemplate SET TemplateConfig = ?, ModifyBy = ?, ModifyDate = ? WHERE PWUserId = ?';
      updateParams = [JSON.stringify(req.body.templateConfig), req.body.PWUserId, new Date(), req.body.PWUserId];


    }
  }

  if (!updateParams.length) {
    req.workflow.outcome.errfor.templateConfig = req.app.utility.message.REQUIRED('Update Params');
    req.workflow.outcome.messege = req.app.utility.message.REQUIRED('Update Params');
    return req.workflow.emit('response');
  }

  req.app.db.query(updateQuery, updateParams, function(err, data) {
    if (err) {
      return next(err);
    } else {

      req.workflow.outcome.data = {};
      req.workflow.outcome.data.masterTemplates = data;
      req.workflow.outcome.message = "Your template has been successfully saved";
      req.workflow.emit('response');

    }
  });
}
