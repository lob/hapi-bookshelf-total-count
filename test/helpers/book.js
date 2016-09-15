'use strict';

const Bookshelf = require('./bookshelf');

module.exports = Bookshelf.Model.extend({
  tableName: 'books',
  filter: function (filter) {
    return this.query((qb) => {
      if (filter.year) {
        qb.where('year', filter.year);
      }
    });
  }
});

