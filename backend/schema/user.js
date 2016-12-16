'use strict';

/**
 *  User Schema
 *
 * @module schema/User
 *
 * @param  {app}      app                      express app object
 * @param  {mongoose} mongoose                 mongoose object
 * @param  {Plugin}   plugin                   custom plugin object
 */
module.exports = function(app, mongoose, plugin) {
  var userSchema = new mongoose.Schema({
    empId: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    },
    usertype: {
      type: Number,
      'default': app.config.User.defaultUser
    },
    googleProfilePicUrl: {
      type: String
    },
    assignedIp: {
      type: String
    }
  }, {
    versionKey: false
  });

  userSchema.plugin(plugin.pageFind);
  userSchema.plugin(plugin.validate);
  userSchema.plugin(plugin.idvalidator, app);

  return userSchema;
};
