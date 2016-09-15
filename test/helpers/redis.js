'use strict';

const Redis = require('then-redis');

module.exports = Redis.createClient({
  port: '6379',
  host: 'localhost'
});
