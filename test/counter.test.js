'use strict';

const Bluebird = require('bluebird');

const Book    = require('./helpers/book');
const Counter = require('../lib/counter');
const Genre   = require('./helpers/genre');
const Redis   = require('./helpers/redis');

describe('counter', () => {

  describe('count', () => {

    it('returns the count for a model without a filter function', () => {
      const request = {};

      return Counter.count(Genre, request)
      .then((count) => {
        expect(count).to.eql(3);
      });
    });

    it('returns the count for a model with a filter function', () => {
      const request = { query: { filter: { year: 1984 } }, auth: { credentials: {} } };

      return Counter.count(Book, request)
      .then((count) => {
        expect(count).to.eql(2);
      });
    });

    it('saves the count to redis under the given key with a ttl when a redis client is given', () => {
      const key = 'key';
      const ttl = () => 10;
      const request = { query: { filter: { year: 1984 } }, auth: { credentials: {} } };

      return Counter.count(Book, request, Redis, key, ttl)
      .then(() => {
        return Bluebird.all([
          Redis.getAsync(key),
          Redis.ttlAsync(key)
        ]);
      })
      .spread((cachedCount, cachedTtl) => {
        expect(cachedCount).to.eql('2');
        expect(cachedTtl).to.eql(10);
      });
    });

  });

});
