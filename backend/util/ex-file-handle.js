'use strict';

var m3 = require('mmmagic');

/**
 * creates Some file handling functions for handling file
 * @class
 */
function FileHandle() {
  this.fs = require('fs-extra');
  this.magic = new m3.Magic(m3.MAGIC_MIME_TYPE);
}

/**
 * creates utility functions for handling messages
 * @member {object}
 * @this FileHandle
 */
FileHandle.prototype.message = require('./message');

/**
 * validate a file and check its mimetype
 * this   FileHandle
 * @param  {object} config                    configuration object
 * @param  {String} config.path           path of the file
 * @param  {RegExp} config.validMime      regular expression so that this function validates the mime
 * @param  {requestCallback} callback         The callback that handles the response.
 * @return {String} mime of the file if the file is validate otherwise null
 */
FileHandle.prototype.validFile = function(config, callback) {
  console.log(arguments);
  var error = {};

  if (!config.path) {
    error.path = this.message.REQUIRED('path');
  }

  if (Object.keys(error).length) {
    return callback(new Error(JSON.stringify(error)));
  }

  this.magic.detectFile(config.path, function(err, data) {
    if (err) {
      return callback(err);
    } else {
      if (new RegExp(config.validMime).test(data)) {
        return callback(null, data);
      } else {
        return callback(null, false);
      }
    }
  });
};

/**
 * clear all files that is send over the multipart
 * @this   FileHandle
 * @param  {Array} files               array of files with the property of path to remove the file
 */
FileHandle.prototype.clearFiles = function(files) {
  var keys = Object.keys(files),
    me = this,
    temp;
  keys.forEach(function(eachKey) {
    temp = Array.isArray(files[eachKey]) ? files[eachKey] : [files[eachKey]];
    temp.forEach(function(eachFile) {
      if (eachFile.path && typeof eachFile.path === 'string') {
        me.removeFile(eachFile.path, function() {});
      }
    });
  });
};

/**
 * clear a single file
 * @this   FileHandle
 * @param  {String} path  path to remove the file
 */
FileHandle.prototype.removeFile = function(path) {
  this.fs.unlink(path, function() {});
};

/**
 * move a file from one folder to another folder
 * @this   FileHandle
 * @param  {object} config                    configuration object
 * @param  {String} config.sourcePath       source path of the file
 * @param  {String} config.destinationPath    destination or target path of the file
 * @param  {requestCallback} callback         The callback that handles the response.
 * @return {String} destination path where the file will be moved
 */
FileHandle.prototype.move = function(config, callback) {
  var error = {};
  if (!config.destinationPath) {
    error.destinationPath = this.message.REQUIRED('destinationPath');
  }
  if (!config.sourcePath) {
    error.sourcePath = this.message.REQUIRED('sourcePath');
  }
  if (Object.keys(error).length) {
    return callback(new Error(JSON.stringify(error)));
  }
  this.fs.rename(config.sourcePath, config.destinationPath, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, config.destinationPath);
    }
  });
};

module.exports = new FileHandle();
