'use strict';

/**
 * this plugin helps you to run hooks or a function on expired date
 * @module mongoose-scheduler
 * @param {mongoose-model} schema                     your schema
 * @param {object}         options                    options that can you passed 
 * @param {String}         options.field              name of the field that has the expires value
 *                                                    note- type of the field must be Date type, on 
 *                                                    the basis of this value this plugin run the 
 *                                                    scheduler
 * @param {String}         [options.interval='1d']    how often the scheduler will run
 * @param {String}         [options.keys='']          what fields you want to select
 * @param {String}         [options.hook=null]        name of the hook that should run on the time
 *                                                    possible hook values are remove and save
 * @param {function}       [options.callback=null]    name of the function that should run on the time 
 * 
 */

var ms = require('ms'),
  defaultOptions = {
    interval: '1d',
    hook: null,
    callback: null,
    keys: ''
  },
  hooks = ['save', 'remove'];

function scheduler(schema, options) {

  var schemaField = schema.tree;

  if (options) {

    if (!options.query && !options.field) {
      throw new Error('Please pass the field or query to run the scheduler');
    }

    if (options.field) {
      options.field = options.field.toString();
      if (options.field.indexOf('.')) {
        options.field = options.field.split('.');
      } else {
        options.field = [options.field];
      }

      for (var i in options.field) {
        schemaField = schemaField[options.field[i]];
        if (!schemaField) {
          break;
        }
      }

      if (!schemaField) {
        throw new Error('Please pass the field that exist in the schema');
      } else {
        try {
          switch (typeof schemaField) {
            case 'function':
              if (schemaField.name !== 'Date') {
                throw new Error('Please pass the field of Date type');
              }
              break;
            case 'object':
              if (schemaField.type.name !== 'Date') {
                throw new Error('Please pass the field of Date type');
              }
              break;
          }
        } catch (e) {
          throw e;
        }

      }

      // set up the query
      options.query = {};
      options.query[options.field] = {
        $lte: new Date()
      };

    }

    // set the default values
    if (!options.interval) {
      options.interval = defaultOptions.interval;
    }
    if (!options.hook) {
      options.hook = defaultOptions.hook;
    }
    if (!options.callback) {
      options.callback = defaultOptions.callback;
    }
    if (!options.keys) {
      options.keys = defaultOptions.keys;
    }

    // configure the scheduler
    options.interval = ms(options.interval);
    if (!options.interval) {
      throw new Error('Please pass the proper interval value');
    }

    if (options.hook) {
      if (hooks.indexOf(options.hook) === -1) {
        throw new Error('Please pass the proper hook value');
      }
    }

    if (options.callback) {
      if (typeof options.callback !== 'function') {
        throw new Error('Please pass a function as an callback');
      }
    }

    var handleData = function(err, data) {
      if (err) {
        throw err;
      }
      if (data.length > 0) {
        data.forEach(function(eachDoc) {
          if (options.hook) {
            eachDoc[options.hook](function() {});
          }
          if (options.callback) {
            options.callback(eachDoc);
          }
        });
      }
    };

    schema.on('init', function(model) {
      setInterval(function() {
        model.find(options.query)
          .select(options.keys)
          .exec(handleData);
      }, options.interval);
    });
  }
}

module.exports = scheduler;
