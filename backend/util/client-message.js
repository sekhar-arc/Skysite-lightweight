'use strict';

/**
 * language object
 * @namespace language
 * @property {object}   en-us        this key holds the en-us language messages
 */
var language = {
  'en-us': require('../lang/en-us'),
};


/**
 * this function sets the development mesages field in the express app variable
 * @memberof language
 * @param  {String}   key             the key of the message
 * @param  {String}   languageKey     the name of the language file.
 *                                    Please ensure that the language key is present
 *                                    in the language namespace
 *
 * @return {String}   the generated message
 */
language.getMessage = function(key, languageKey) {
  return language[languageKey][key];
};

module.exports = language.getMessage;
