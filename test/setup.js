'use strict';

const Chai = require('chai');
const Knex  = require('./helpers/knex');
const Redis = require('./helpers/redis');

global.expect = Chai.expect;

exports.mochaHooks = {
  beforeAll (done) {
    Redis.connect().then(() => done());
  },

  beforeEach (done) {
    Promise.all([
      Knex.schema.dropTableIfExists('genres'),
      Knex.schema.dropTableIfExists('books')
    ])
      .then(() => {
        return Promise.all([
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
        return Promise.all([
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
      .then(() => Redis.flushAll())
      .then(() => done());
  },

  afterAll (done) {
    Redis.disconnect().then(() => done());
  }
};
