'use strict';

/**
 * creates utility functions for  handling aws s3 requests
 * @class
 * @param {object} config                   configuration object
 * @param {string} config.accessKeyId      access key id of the amazon
 * @param {string} config.secretAccessKey  secret access key id of the amazon
 */
function S3Util(config) {
  var AWS = require('aws-sdk');
  AWS.config.update(config);
  this.s3 = new AWS.S3({
    maxRetries: config.maxRetries,
    httpOptions: {
      timeout: config.timeout
    }
  });
}

/**
 * returns the url of the key after or before uploading an object into the server
 * @this   S3Util
 * @param  {object} config            configuration object
 * @param  {String} config.bucket     name of the bucket object
 * @param  {String} config.key        name of the item inside this bucket
 * @return {String}                   url of the key indide that bucket
 */
S3Util.prototype.getUrl = function(config) {
  var url = this.s3.getSignedUrl('getObject', {
    Bucket: config.bucket,
    Key: config.key
  });
  return url.substr(0, url.indexOf('?'));
};

/**
 * remove an existing bucket from amazon s3
 * @this   S3Util
 * @param  {String} bucketName                name of the bucket object
 * @param  {requestCallback} callback         The callback that handles the response.
 * more about the return type in callback
 * {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property}
 */
S3Util.prototype.removeBucket = function(bucketName, callback) {
  this.s3.deleteBucket({
    Bucket: bucketName
  }, callback);
};

/**
 * remove an existing key from amazon s3 bucket
 * @this   S3Util
 * @param  {object} config            configuration object
 * @param  {String} config.bucket     name of the bucket object
 * @param  {String} config.key        name of the item inside this bucket
 * @param  {requestCallback} callback         The callback that handles the response.
 * more about the return type in callback
 * {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property}
 */
S3Util.prototype.removeObject = function(config, callback) {

  this.s3.deleteObject({
    Bucket: config.bucket,
    Key: config.key,
  }, callback);

};



//remove multiple objects from s3

S3Util.prototype.removeMultipleObjects = function(config, callback) {

  this.s3.deleteObjects({
    Bucket: config.bucket,
    Delete: config.delete,
  }, callback);

};

/**
 * create a bucket in amazon s3
 * @this   S3Util
 * @param  {object} config                    configuration object
 * @param  {String} config.bucket             name of the bucket object
 * @param  {String} config.ACL                ACL of the bucket
 * @param  {requestCallback} callback         The callback that handles the response.
 * @return { Boolean}  if the bucket creation is successfull then true otherwise null
 */
S3Util.prototype.createBucket = function(config, callback) {
  this.s3.createBucket({
    Bucket: config.bucket,
    ACL: config.ACL
  }, function(err) {
    if (err) {
      if (err.code === 'BucketAlreadyOwnedByYou') {
        callback(null, true);
      } else {
        callback(err);
      }
    } else {
      callback(null, true);
    }
  });
};

/**
 * upload a file into an amazon bucket
 * @this   S3Util
 * @param  {object} config                    configuration object
 * @param  {String} config.bucket             name of the bucket object
 * @param  {String} config.key                name of the item inside this bucket
 * @param  {String} config.path               path of the file
 * @param  {String} config.ACL                ACl of the key inside the bucket
 * @param  {requestCallback} callback         The callback that handles the response.
 * more about the return type in callback
 * {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property}
 */
S3Util.prototype.uploadInS3 = function(config, callback) {
  this.s3.putObject({
    Bucket: config.bucket,
    Key: config.key,
    Body: require('fs').createReadStream(config.path),
    ACL: config.ACL
  }, callback);
};

module.exports = function(config) {
  return new S3Util(config);
};
