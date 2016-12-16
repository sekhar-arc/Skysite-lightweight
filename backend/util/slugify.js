'use strict';

/**
 * creates utility functions for some utility functions
 * @class
 */

function Utility() {}


/**
 * this function makes an equivalent object from an array
 * Please make sure the values of field should be unique
 * @this Utility
 * @param  {Array}   array           array of objects
 * @param  {String}  [field='_id']   the field that should present in the array
 * @param  {String}  [property]      the field that should present in the array and only store this property
 * @param  {Boolean} makeArray       if you want to store the property in an array
 * @return {object}                 equivalent object pattern of the array
 */
Utility.prototype.makeObject = function(array, field, property, makeArray) {

  if (!array || !Array.isArray(array)) {
    return {};
  }

  if (!field) {
    field = ['_id'];
  } else {
    field = field.split('.');
  }

  var response = {},
    tempKey;

  array.forEach(function(eachDoc) {
    tempKey = null;
    field.forEach(function(each) {
      if (tempKey) {
        tempKey = tempKey[each];
      } else {
        tempKey = eachDoc[each];
      }
    });
    if (tempKey) {
      if (property) {
        if (makeArray) {
          if (!response[tempKey.toString()]) {
            response[tempKey.toString()] = [];
          }
          response[tempKey.toString()].push(eachDoc[property]);
        } else {
          response[tempKey.toString()] = eachDoc[property];
        }
      } else {
        response[tempKey.toString()] = eachDoc;
      }
    }
  });

  return response;

};

/**
 * this function makes an equivalent array from an object
 *
 * @this Utility
 * 
 * @param  {Object}  object         object
 * @param  {String}  [sortProperty] if you want to sort the generated result 
 *                                  in the base of a particular property
 * 
 * @return {Array}                  equivalent array of all keys
 */
Utility.prototype.makeArray = function(object, sortProperty) {
  var response = [];
  for (var key in object) {
    response.push(object[key]);
  }

  if (sortProperty && sortProperty.length) {
    response.sort(function(prev, next) {
      return prev[sortProperty] < next[sortProperty] ? 1 : -1;
    });
  }
  return response;
};

/**
 * this function checks whether an item is present in the array or not
 * @this Utility
 * @param  {Array}         array array of itmes
 * @param  {String}        item  itme that to be found in the array
 * @return {Boolean}       if found then return true otherwise false
 */
Utility.prototype.isExist = function(array, item) {

  if (!array) {
    return false;
  }

  if (!item) {
    return false;
  }

  var response = false;

  array.forEach(function(eachDoc) {
    if (typeof item === 'string') {
      if (eachDoc.toString() === item.toString()) {
        response = true;
      }
    } else if (typeof item === 'function') {
      response = item(eachDoc);
    }
  });

  return response;

};
/**
 * This function return the nonhtml portion from the html string
 * @this Utility
 * @param  {object} config                            configuration object
 * @param {String} config.html                        html string
 * @param {RegExp} [config.regExp=/(<([^>]+)>)/ig]    regExpression to check the html string
 *
 * @return {string}                                   nonhtml string
 */
Utility.prototype.removeHtml = function(config) {

  //if not the htm string return emptry string
  if (!config.html) {
    return '';
  }

  config.html = config.html.toString();
  config.html = config.html.replace(/&nbsp;/g, ' ');

  //check whther the 
  if (!config.regExp) {
    config.regExp = /(<([^>]+)>)/ig;
  } else {
    config.regExp = new RegExp(config.regExp);
  }

  //returning the non html portion by replacing the html tags
  return config.html.replace(config.regExp, '');

};

/**
 * This function generate 6 digit random uniq combination of digits and alphabets
 * @this Utility
 * @param  {Number} [length=6]  length of the code
 * @return {string}             generated token of length either supplied length or 6
 */
Utility.prototype.getRandomCode = function(length) {
  var codeString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
    output = '',
    index;

  if (!length) {
    length = 6;
  }

  for (var i = 0; i < length; i++) {
    index = Math.floor(Math.random() * codeString.length);

    if (index === 1) {
      index = index - 1;
    }
    output += codeString[index];
  }

  return output;

};


Utility.prototype.getRandomPassword = function(length) {
  var codeString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
    output = '',
    finalOutput = '',
    index;
  if (!length) {
    length = 6;
  }
  length = length - 2;
  for (var i = 0; i < length; i++) {
    index = Math.floor(Math.random() * codeString.length);

    if (index === 1) {
      index = index - 1;
    }
    output += codeString[index];
  }
  var capString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numString = '1234567890',
    numIndex,
    capIndex;
  capIndex = Math.floor(Math.random() * capString.length);
  numIndex = Math.floor(Math.random() * numString.length);
  finalOutput = capString[capIndex] + output + numString[numIndex];


  return finalOutput;

};

module.exports = new Utility();
