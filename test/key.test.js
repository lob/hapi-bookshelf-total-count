'use strict';

const Book  = require('./helpers/book');
const Genre = require('./helpers/genre');
const Key   = require('../lib/key');

describe('key', () => {

  describe('generate', () => {

    it('returns a simple key for a model without a filter', () => {
      expect(Key.generate(Genre, {})).to.eql('hapi-bookshelf-total-count:genres::');
    });

    it('returns a hashed key for a model with a filter', () => {
      const request = { query: { filter: {} } };
      expect(Key.generate(Book, request)).to.match(/^hapi-bookshelf-total-count:books::/);
    });

    it('adds a unique key if a function is provided', () => {
      const uniqueKey = () => 'unique';
      expect(Key.generate(Genre, {}, uniqueKey)).to.eql(`hapi-bookshelf-total-count:genres:unique:`);
    });

    it('returns identical keys for filter objects that are equivalent in value but not order', () => {
      const request1 = { query: { filter: { a: 'A', b: 'B', c: 'C' } } };
      const request2 = { query: { filter: { c: 'C', a: 'A', b: 'B' } } };
      expect(Key.generate(Book, request1)).to.eql(Key.generate(Book, request2));
    });

    it('returns different keys for filter objects that are similar but not equivalent', () => {
      const request1 = { query: { filter: { a: 'A', b: 'B', c: 'C' } } };
      const request2 = { query: { filter: { a: 'A', b: 'B', c: 'D' } } };
      expect(Key.generate(Book, request1)).to.not.eql(Key.generate(Book, request2));
    });

  });

});
