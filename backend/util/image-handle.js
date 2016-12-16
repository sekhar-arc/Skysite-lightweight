'use strict';

/** 
  @typedef ImageHandle-validate-response
  @memberof ImageHandle
  @type {Object} 
  @property {Number} x          horizontal resolution of the image
  @property {Number} y          vertical resolution of the image
  @property {Number} width      width of the image
  @property {Number} height     height of the image
  @property {String} format     format of the image
*/

/**
 * creates utility functions for handling image
 * @class
 */
function ImageHandle() {
  // this.im = require('imagemagick');
  this.sizeOf = require('image-size');
}

/**
 * creates utility functions for handling messages
 * @member {object}
 * @this ImageHandle
 */
ImageHandle.prototype.message = require('./message');

/**
 * check whether the image is valid or not
 * @this   ImageHandle
 * @param  {object} config                    configuration object
 * @param  {String} config.path               path of the image
 * @param  {requestCallback} callback         The callback that handles the response.
 * @return {ImageHandle-validate-response}    iff the image is valid it will get the object
 *                                            with the keys format,x,y,width,height for format
 *                                            of the image, horizontal resolution, certical
 *                                            resolution, width and height of the
 *                                            image respectively
 */
ImageHandle.prototype.detectFile = function(config, callback) {
  var error = {};
  if (!config.path) {
    error.path = this.message.REQUIRED('path');
  }

  if (Object.keys(error).length > 0) {
    return callback(new Error(JSON.stringify(error)));
  }

  this.sizeOf(config.path, function(err, dimensions) {
    if (err) {
      return callback(err);
    }

    return callback(null, {
      format: config.path.substr(config.path.lastIndexOf('.')),
      width: Number(dimensions.width),
      height: Number(dimensions.height),
    });

  });
};

module.exports = new ImageHandle();
