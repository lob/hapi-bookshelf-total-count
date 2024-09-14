'use strict';

const RADIX = 10;

exports.count = (Model, request, Redis, key, ttlFn) => {
  return Promise.resolve()
    .then(() => {
      if (typeof Model.prototype.filter === 'function') {
        return new Model().filter(request.query.filter, request.auth.credentials).count('*');
      }
      return new Model().count('*');
    })
    .then((count) => {
      return parseInt(count, RADIX);
    })
    .then(async (count) => {
      if (Redis) {
        const seconds = ttlFn(count);
        await Redis.set(key, count, {EX: seconds});
      }
      return count;
    });
};
