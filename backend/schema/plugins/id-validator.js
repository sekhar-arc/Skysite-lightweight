"use strict";
/**
 * Mongoose plugin to validate that ObjectID references refer to objects that actually exist in the referenced collection
 * @module schema/plugins/idValidator-plugin
 */
module.exports = function idvalidator(schema, app) {

  var message = "{PATH} references a non existing ID";

  schema.eachPath(function(path, schemaType) {
    var validateFunction = null;
    var refModelName = null;
    var conditions = {};

    if (schemaType.options && schemaType.options.ref) {
      validateFunction = validateId;
      refModelName = schemaType.options.ref;
      if (schemaType.options.refConditions) {
        conditions = schemaType.options.refConditions;
      }
    } else if (schemaType.caster && schemaType.caster.instance && schemaType.caster.options && schemaType.caster.options.ref) {
      validateFunction = validateIdArray;
      refModelName = schemaType.caster.options.ref;
      if (schemaType.caster.options.refConditions) {
        conditions = schemaType.caster.options.refConditions;
      }
    }

    if (validateFunction) {
      schema.path(path).validate(function(value, respond) {
        validateFunction(this, refModelName, value, conditions, respond);
      }, message);
    }
  });

  function executeQuery(query, conditions, validateValue, respond) {
    for (var fieldName in conditions) {
      query.where(fieldName, conditions[fieldName]);
    }
    query.exec(function(err, count) {
      if (err) {
        return respond(err);
      }
      respond(count === validateValue);
    });
  }

  function validateId(doc, refModelName, value, conditions, respond) {
    if (!value) {
      return respond(true);
    }
    var refModel = app.db.models[refModelName];
    var query = refModel.count({
      _id: value
    });
    executeQuery(query, conditions, 1, respond);
  }

  function validateIdArray(doc, refModelName, values, conditions, respond) {
    if (values.length === 0) {
      return respond(true);
    }
    var refModel = app.db.models[refModelName];
    var query = refModel.count().where("_id")["in"](values);
    executeQuery(query, conditions, values.length, respond);
  }

};
