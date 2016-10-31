'use strict';

const Bluebird = require('bluebird');

const Knex  = require('./helpers/knex');
const Redis = require('./helpers/redis');

beforeEach(() => {
  return Bluebird.all([
    Knex.schema.dropTableIfExists('books'),
    Knex.schema.dropTableIfExists('genres')
  ])
  .then(() => {
    return Bluebird.all([
      Knex.schema.createTable('books', (table) => {
        table.increments();
        table.string('name');
        table.integer('year');
      }),
      Knex.schema.createTable('genres', (table) => {
        table.increments();
        table.string('name');
      })
    ]);
  })
  .then(() => {
    return Bluebird.all([
      Knex('books').insert([
        { name: 'Surely You\'re Joking, Mr. Feynman!', year: 1984 },
        { name: 'Sister Outsider', year: 1984 },
        { name: 'Season of the Witch', year: 2013 }
      ]),
      Knex('genres').insert([
        { name: 'Feminism' },
        { name: 'History' },
        { name: 'Science' }
      ])
    ]);
  })
  .then(() => Redis.flushallAsync());
});
