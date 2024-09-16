'use strict';

const Joi = require('joi');

module.exports = Joi.object({
  query: Joi.object().keys({
    include: Joi.array().items(Joi.string().valid('total_count').required(), Joi.any()).required()
  }),
  response: Joi.object().keys({
    source: Joi.object().required()
  })
});

