'use strict';

const Joi = require('joi');

module.exports = {
  query: Joi.object().keys({
    include: Joi.array().items(Joi.string().valid('approximate_count').required(), Joi.any()).required()
  }),
  response: Joi.object().keys({
    source: Joi.object().required()
  })
};
