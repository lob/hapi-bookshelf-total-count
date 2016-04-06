'use strict';

const Joi = require('joi');

const Validator = require('../lib/validator');

describe('validator', () => {

  const options = { allowUnknown: true };

  it('requires "include" array with total_count', () => {
    const request = {
      query: { include: ['total_amount'] },
      response: { source: {} }
    };
    const result = Joi.validate(request, Validator, options);

    expect(result.error).to.match(/"include" does not contain 1 required value/);
  });

  it('requires a response source object', () => {
    const request = {
      query: { include: ['total_count'] },
      response: { source: null }
    };
    const result = Joi.validate(request, Validator, options);

    expect(result.error).to.match(/"source" must be an object/);
  });

});
