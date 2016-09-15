'use strict';

const Bluebird = require('bluebird');

const RADIX = 10;

exports.count = (Model, request, Redis, key, ttlFn) => {
  return Bluebird.resolve()
  .then(() => {
    if (typeof Model.prototype.filter === 'function') {
      return new Model().filter(request.query.filter, request.auth.credentials).count('*');
    }
    return new Model().count('*');
  })
  .then((count) => {
    return parseInt(count, RADIX);
  })
  .tap((count) => {
    if (Redis) {
      const seconds = ttlFn(count);
      return Redis.set(key, count, 'EX', seconds);
    }
  });
};
