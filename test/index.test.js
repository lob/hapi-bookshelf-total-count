'use strict';

const Knex      = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './test/test.sqlite3'
  },
  useNullAsDefault: true
});
const Bluebird  = require('bluebird');
const Bookshelf = require('bookshelf')(Knex);
const Hapi      = require('hapi');

const Book  = Bookshelf.Model.extend({
  tableName: 'books',
  filter: function (filter) {
    return this.query((qb) => {
      if (filter.year) {
        qb.where('year', filter.year);
      }
    });
  }
});
const Genre = Bookshelf.Model.extend({ tableName: 'genres' });

const handler = (request, reply) => {
  reply({});
};

describe('plugin', () => {

  let server;

  before(() => {
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
    });
  });

  beforeEach(() => {
    server = new Hapi.Server();
    server.connection({ port: 80 });
    server.register([
      require('inject-then'),
      {
        register: require('hapi-query-filter'),
        options: { ignoredKeys: ['include'] }
      },
      require('../lib')
    ], () => {});
  });

  it('appends the total for models that have a filter function', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          queryFilter: { enabled: true },
          totalCount: { model: Book }
        },
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/books?year=1984&include[]=total_count',
      credentials: {}
    })
    .then((res) => {
      expect(res.result.total_count).to.eql(2);
    });
  });

  it('appends the total for models that do not have a filter function', () => {
    server.route({
      method: 'GET',
      path: '/genres',
      config: {
        plugins: {
          totalCount: { model: Genre }
        },
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/genres?include[]=total_count',
      credentials: {}
    })
    .then((res) => {
      expect(res.result.total_count).to.eql(3);
    });
  });

  it('appends the total when used with the hapi-query-filter plugin', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          queryFilter: { enabled: true },
          totalCount: { model: Book }
        },
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/books?year=1984&include[]=total_count',
      credentials: {}
    })
    .then((res) => {
      expect(res.result.total_count).to.eql(2);
    });
  });

  it('appends the unfiltered total when used without the hapi-query-filter plugin', () => {
    server.route({
      method: 'GET',
      path: '/genres',
      config: {
        plugins: {
          queryFilter: { enabled: false },
          totalCount: { model: Genre }
        },
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/genres?include[]=total_count',
      credentials: {}
    })
    .then((res) => {
      expect(res.result.total_count).to.eql(3);
    });
  });

  it('does not append the total when the plugin is disabled', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {},
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/books?include[]=total_count',
      credentials: {}
    })
    .then((res) => {
      expect(res.statusCode).to.eql(200);
      expect(res.result).to.not.have.property('total_count');
    });
  });

  it('does not append the total when request validation is not met', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          totalCount: { model: Book }
        },
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/books',
      credentials: {}
    })
    .then((res) => {
      expect(res.statusCode).to.eql(200);
      expect(res.result).to.not.have.property('total_count');
    });
  });

  it('errors on incorrect initialization', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          totalCount: { model: null }
        },
        handler
      }
    });

    return server.injectThen({
      method: 'GET',
      url: '/books?include[]=total_count',
      credentials: {}
    })
    .then((res) => {
      expect(res.statusCode).to.eql(500);
    });
  });

});
