'use strict';

module.exports = function(app, mongoose) {
  /**
   * Plugin name space holds plugins that we are using to intantiate the mongoose modesl
   * @namespace Plugin
   * @property {plugin}   pageFind            pagefind plugin to send huge data in paged manner
   * @property {plugin}   validate            help to validate the body and saved object
   * @property {plugin}   idvalidator         validate your ref properties befor saving
   * @property {plugin}   mongooseScheduler   helps to run a schedule job
   */
  var plugin = {
    pageFind: require('./schema/plugins/pagedFind'),
    validate: require('./schema/plugins/validate'),
    idvalidator: require('./schema/plugins/id-validator')
  };

};
