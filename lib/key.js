'use strict';

const ObjectHash = require('object-hash');

exports.generate = (Model, request, uniqueKeyFn) => {
  const tableName = Model.prototype.tableName;
  let filterHash = '';
  let uniqueKey = '';

  if (typeof Model.prototype.filter === 'function') {
    filterHash = ObjectHash(request.query.filter);
  }

  if (uniqueKeyFn) {
    uniqueKey = uniqueKeyFn(request);
  }

  return `hapi-bookshelf-total-count:${tableName}:${uniqueKey}:${filterHash}`;
};
