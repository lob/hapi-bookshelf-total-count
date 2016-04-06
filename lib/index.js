'use strict';

const Bluebird = require('bluebird');
const Joi      = require('joi');

const Validator = require('./validator');

const RADIX = 10;

exports.register = (server, options, next) => {

  server.ext('onPreResponse', (request, reply) => {

    const settings = request.route.settings.plugins.totalCount;
    const credentials = request.auth.credentials;
    const validation = Joi.validate(request, Validator, { allowUnknown: true });

    if (!settings || validation.error) {
      return reply.continue();
    }

    return Bluebird.resolve(settings.model)
    .then((Model) => {
      if (typeof Model.prototype.filter === 'function') {
        return new Model().filter(request.query.filter, credentials).count('*');
      }
      return new Model().count('*');
    })
    .then((count) => {
      request.response.source.total_count = parseInt(count, RADIX);
      reply.continue();
    })
    .catch((err) => reply(err));
  });

  next();

};

exports.register.attributes = {
  pkg: require('../package.json')
};
