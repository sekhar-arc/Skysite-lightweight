'use strict';

/**
 *  SessionCustom Schema
 *
 * @module schema/SessionCustom
 *
 * @param  {app}      app                      express app object
 * @param  {mongoose} mongoose                 mongoose object
 * @param  {Plugin}   plugin                   custom plugin object
 */
module.exports = function(app, mongoose, plugin) {
  var SessionCustom = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deviceId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    destroyTime: {
      type: Date,
      required: true
    }
  }, {
    versionKey: false
  });

  SessionCustom.plugin(plugin.pageFind);
  SessionCustom.plugin(plugin.validate);
  SessionCustom.plugin(plugin.idvalidator, app);

  return SessionCustom;
};
