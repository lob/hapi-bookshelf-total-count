'use strict';

const Knex = require('./knex');

module.exports = require('bookshelf')(Knex);
