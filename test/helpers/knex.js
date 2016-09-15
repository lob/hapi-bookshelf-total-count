'use strict';

module.exports = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './test/test.sqlite3'
  },
  useNullAsDefault: true
});
