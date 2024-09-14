'use strict';

const Joi      = require('joi');

const ApproximateCountValidator = require('./validators/approximate-count');
const Counter                   = require('./counter');
const Key                       = require('./key');
const TotalCountValidator       = require('./validators/total-count');

/** @typedef {import('@hapi/hapi').Server} Server } */

/** @typedef {import('redis').RedisClientType} RedisClient } */

/**
 * Registers the events routes.
 * @param {Server} server
 * @param {{ ttl: number?, redisClient: RedisClient?, uniqueKey: Function? }} options
 */
function register (server, options) {

  server.ext('onPreResponse', (request, h) => {

    const settings = request.route.settings.plugins.totalCount;
    const includeApproximate = !settings || !settings.include || settings.include.indexOf('approximate') !== -1;
    const includeTotal = !settings || !settings.include || settings.include.indexOf('total') !== -1;
    const approximateCountValid = includeApproximate ? !ApproximateCountValidator.validate(request, { allowUnknown: true }).error : false;
    const totalCountValid = includeTotal ? !TotalCountValidator.validate(request, { allowUnknown: true }).error : false;

    if (!settings || !settings.model || (!approximateCountValid && !totalCountValid)) {
      return h.continue;
    }

    const Model = settings.model;
    const Redis = options.redisClient;
    const ttl = options.ttl;
    const key = Key.generate(Model, request, options.uniqueKey);

    return Promise.resolve()
      .then(() => {
        if (Redis && approximateCountValid) {
          return Redis.get(key);
        }
      })
      .then((cachedCount) => {
        if (cachedCount) {
          return parseInt(cachedCount);
        }

        return Counter.count(Model, request, Redis, key, ttl);
      })
      .then((count) => {
        if (approximateCountValid) {
          request.response.source.approximate_count = count;
        } else {
          request.response.source.total_count = count;
        }
        return h.continue;
      }).catch(err => {
        throw err;
      });
  });
}

exports.plugin = {
  pkg: require('../package.json'),
  register
};
