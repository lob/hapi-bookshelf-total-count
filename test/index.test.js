'use strict';

const Hapi = require('@hapi/hapi');
const QS   = require('qs');

const Book  = require('./helpers/book');
const Genre = require('./helpers/genre');
const Redis = require('./helpers/redis');

/** @typedef {import('@hapi/hapi').Server} Server } */

const handler = () => {
  return {};
};

describe('plugin', () => {

  /**
   * Registers the events routes.
   * @param {Server} server
   */
  let server;

  beforeEach(async () => {
    server = new Hapi.Server({
      port: 80,
      query: {
        parser: (query) => {
          // replaces hapi-qs
          return QS.parse(query);
        }
      }
    });

    await server.register([
      {
        plugin: require('hapi-query-filter'),
        options: { ignoredKeys: ['include'] }
      },
      {
        plugin: require('../lib'),
        options: {
          redisClient: Redis,
          ttl: () => 10,
          uniqueKey: () => 'unique'
        }
      }
    ]);
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

    return server.inject({
      method: 'GET',
      url: '/books?year=1984&include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
        expect(res.result.total_count).to.eql(2);
      });
  });

  it('does not include approximate count if only total count is specified in include field in the plugin', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          queryFilter: { enabled: true },
          totalCount: {
            include: ['total'],
            model: Book
          }
        },
        handler
      }
    });

    return server.inject({
      method: 'GET',
      url: '/books?year=1984&include[]=approximate_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.result.approximate_count).to.be.undefined;
      });
  });

  it('does not include total count if only approximate count is specified in include field in the plugin', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          queryFilter: { enabled: true },
          totalCount: {
            include: ['approximate'],
            model: Book
          }
        },
        handler
      }
    });

    return server.inject({
      method: 'GET',
      url: '/books?year=1984&include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.result.total_count).to.be.undefined;
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

    return server.inject({
      method: 'GET',
      url: '/genres?include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.result.total_count).to.eql(3);
      });
  });

  it('fetches approximate count from redis', () => {
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

    return Redis.set('hapi-bookshelf-total-count:books:unique:dd82f1d2fe8efa0793df67c43cf9a0f775b0eca1', 12345)
      .then(() => {
        return server.inject({
          method: 'GET',
          url: '/books?year=1984&include[]=approximate_count',
          auth: {
            strategy: 'basic',
            credentials: {}
          }
        });
      })
      .then((res) => {
        expect(res.result.approximate_count).to.eql(12345);
      });
  });

  it('sets approximate count in redis with total count', () => {
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

    return server.inject({
      method: 'GET',
      url: '/books?year=1984&include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then(() => {
        return Redis.get('hapi-bookshelf-total-count:books:unique:dd82f1d2fe8efa0793df67c43cf9a0f775b0eca1');
      })
      .then((count) => {
        expect(count).to.eql('2');
      });
  });

  it('sets approximate count in redis with approximate count if it is not yet set', () => {
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

    return server.inject({
      method: 'GET',
      url: '/books?year=1984&include[]=approximate_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then(() => {
        return Redis.get('hapi-bookshelf-total-count:books:unique:dd82f1d2fe8efa0793df67c43cf9a0f775b0eca1');
      })
      .then((count) => {
        expect(count).to.eql('2');
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

    return server.inject({
      method: 'GET',
      url: '/books?include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
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

    return server.inject({
      method: 'GET',
      url: '/books',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
        expect(res.result).to.not.have.property('total_count');
      });
  });

  it('does not append total_count on incorrect initialization', () => {
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

    return server.inject({
      method: 'GET',
      url: '/books?include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
        expect(res.result).to.not.have.property('total_count');
      });
  });

  it('responds with an error if there is an internal error', () => {
    server.route({
      method: 'GET',
      path: '/books',
      config: {
        plugins: {
          totalCount: { model: { prototype: { tableName: 'invalid' } } }
        },
        handler
      }
    });

    return server.inject({
      method: 'GET',
      url: '/books?include[]=total_count',
      auth: {
        strategy: 'basic',
        credentials: {}
      }
    })
      .then((res) => {
        expect(res.statusCode).to.eql(500);
      });
  });

});
