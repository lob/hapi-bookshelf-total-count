'use strict';

const Book    = require('./helpers/book');
const Counter = require('../lib/counter');
const Genre   = require('./helpers/genre');
const Redis   = require('./helpers/redis');

describe('counter', () => {

  describe('count', () => {

    it('returns the count for a model without a filter function', async () => {
      const request = {};

      return Counter.count(Genre, request)
        .then((count) => {
          expect(count).to.eql(3);
        });
    });

    it('returns the count for a model with a filter function', async () => {
      const request = { query: { filter: { year: 1984 } }, auth: { credentials: {} } };

      const count = await Counter.count(Book, request);

      expect(count).to.eql(2);
    });

    it('saves the count to redis under the given key with a ttl when a redis client is given', async () => {
      const key = 'key';
      const ttl = () => 10;
      const request = { query: { filter: { year: 1984 } }, auth: { credentials: {} } };

      await Counter.count(Book, request, Redis, key, ttl);

      const cachedCount = await Redis.get(key);
      const cachedTtl = await Redis.ttl(key);

      expect(cachedCount).to.eql('2');
      expect(cachedTtl).to.eql(10);
    });

  });

});
