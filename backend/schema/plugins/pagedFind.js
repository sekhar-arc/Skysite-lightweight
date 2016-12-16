'use strict';

/**
 * paged Find plugin attach a statics into your schema with the name pagedFind
 * @module schema/plugins/paged-find-plugin
 */

module.exports = function pagedFindPlugin(schema) {

  /**
   * Finds list of documents from a given schema
   * @param  {object}           options           options to find the object
   * @param  {Number}           options.limit     the total number of objects that is max can be returned
   * @param  {Number}           options.skip      the total number of objects that should skip
   * @param  {String}           options.keys      the keys that should be selected
   * @param  {object}           options.filters   query for finding result
   * @param  {object}           options.sort      sort object for finding result
   * @param  {requestCallback}  cb                callback to be executed after the find operation
   *
   * @memberof module:paged-Find-plugin
   *
   * @this schema
   *
   * @example
   * var A = mongoose.models('a' , new mongosoe.Schema({
   *    x : {
   *      type : String,
   *      match : /a/,
   *      required : true
   *    }
   * }));
   *
   * A.plugin('path to page find plugin');
   *
   *
   * A.pagedFind({},function (err,result) {
   *  console.log(err,result); // iff validation failed
   * });
   *
   */

  function pagedFind(options, cb) {

    var thisSchema = this;

    if (!options.filters) {
      options.filters = {};
    }

    if (!options.keys) {
      options.keys = '';
    }

    if (options.limit === undefined || options.limit === null) {
      options.limit = 30;
    }

    if (!options.skip) {
      options.skip = 0;
    }

    if (!options.sort) {
      options.sort = {};
    }

    var output = {
      data: null,
      skip: options.skip,
      limit: options.limit,
      total: 0
    };


    var countResults = function(callback) {
      thisSchema.count(options.filters, function(err, count) {
        if (err) {
          return callback(err);
        } else {
          output.total = count;
          if (options.limit === 0) {
            output.skip = 0;
            output.limit = output.total;
          }
          return callback(null, 'done counting');
        }
      });
    };

    var getResults = function(callback) {
      var query = thisSchema.find(options.filters, options.keys);

      if (options.limit !== 0) {
        query.skip(options.skip);
        query.limit(options.limit);
      }

      query.sort(options.sort);

      if (options.populate) {
        query.populate(options.populate);
      }

      if (options.lean) {
        query.lean();
      }

      query.exec(function(err, results) {
        if (err) {
          return callback(err);
        } else {
          output.data = results;
          return callback(null, 'done getting records');
        }
      });
    };

    require('async').parallel([
        countResults,
        getResults
      ],
      function(err) {
        if (err) {
          return cb(err, null);
        } else {
          return cb(null, output);
        }
      });
  }

  schema.statics.pagedFind = pagedFind;

};
