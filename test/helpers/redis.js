'use strict';

const Redis    = require('redis');

module.exports = Redis.createClient({
  port: '6379',
  host: 'localhost'
});

