'use strict';

const Bluebird = require('bluebird');
const Redis    = require('redis');

Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

module.exports = Redis.createClient({
  port: '6379',
  host: 'localhost'
});
