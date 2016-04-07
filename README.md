# Hapi Bookshelf Total Count

A [Hapi](http://hapijs.com/) plugin used with [Bookshelf](http://bookshelfjs.org/) models to calculate the total number of records that match a query and appends it to the response. It can be used to calculate an [absolute total count](#absolute-total-count) or a [filtered total count](#filtered-total-count).

## Absolute Total Count

Appends the `total_count` of all instances of the model when the query contains `include[]=total_count`, regardless of query filter.

### Register the Plugin

```js
const Hapi = require('hapi');

const server = new Hapi.Server();

server.register([
  require('hapi-bookshelf-total-count')
], (err) => {

});
```

### Configure the endpoint

```js
const Bookshelf = require('bluebird')(require('knex')(config));

const Book = Bookshelf.Model.extend({ tableName: 'books' });

server.route({
  method: 'GET',
  path: '/books',
  config: {
    plugins: {
      totalCount: { model: Book }
    },
    handler: (request, reply) => {
      return new Book().fetchAll()
      .then((books) => {
        reply({ data: books });
      });
    }
  }
});

```

### Request

```bash
$ curl -g GET "https://YOUR_DOMAIN/books?include[]=total_count"
```

### Response

```
{
  "data": [...],
  "total_count": 100
}
```

## Filtered Total Count

Appends the `total_count` of a subset of model instances that match a query filter when the query contains `include[]=total_count`. In order to calculate a filtered `total_count`, you'll need to use this plugin in conjunction with [hapi-query-filter](https://github.com/lob/hapi-query-filter) and define a `filter` function on each model that will be filtered. The model's `filter` function is intended to be reused by the list endpoint.

### Register the Plugin

```js
const Hapi = require('hapi');

const server = new Hapi.Server();

server.register([
  require('hapi-bookshelf-total-count'),
  {
    register: require('hapi-query-filter'),
    options: { ignoredKeys: ['include'] }
  }
], (err) => {

});
```

### Define a filter function on the model

```js
// models/book.js

const Bookshelf = require('bluebird')(require('knex')(config));

module.exports = Bookshelf.Model.extend({
  tableName: 'books'
  /**
   * @param {Object} filter - from request.query.filter
   * @param {Object} [credentials] - from request.auth.credentials
   * You may add any additional parameters after filter and credentials
   */
  filter: function (filter, credentials) {
    return this.query((qb) => {
      qb.where('deleted', false);

      if (filter.year) {
        qb.where('year', filter.year);
      }
    });
  }
});
```

### Configure the endpoint

```js
const Book = require('../models/book');

server.route({
  method: 'GET',
  path: '/books',
  config: {
    plugins: {
      queryFilter: { enabled: true },
      totalCount: { model: Book }
    },
    handler: (request, reply) => {
      return new Book().filter(request.query.filter, request.auth.credentials)
      .fetchAll()
      .then((books) => {
        reply({ data: books });
      });
    }
  }
});
```

### Request

```bash
$ curl -g GET "https://YOUR_DOMAIN/books?year=1984&include[]=total_count"
```

### Response

```
{
  "data": [...],
  "total_count": 20
}
```
