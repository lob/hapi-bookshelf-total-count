'use strict';

const ObjectHash = require('object-hash');

/** @typedef {import('bookshelf').Model} Model */

/** @typedef {import('@hapi/hapi').Request} Request */

/**
 * Generates a cache key for the approximate count value.
 * @param {Model} Model
 * @param {Request} request
 * @param {Function?} uniqueKeyFn
 * @returns {String} The cache key
 */
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
