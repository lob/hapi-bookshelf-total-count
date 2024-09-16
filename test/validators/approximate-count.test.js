'use strict';

const Validator = require('../../lib/validators/approximate-count');

describe('approximate count validator', () => {

  const options = { allowUnknown: true };

  it('requires "include" array with approximate_count', () => {
    const request = {
      query: { include: ['approximate_amount'] },
      response: { source: {} }
    };
    const result = Validator.validate(request, options);

    expect(result.error).to.match(/"query.include" does not contain 1 required value/);
  });

  it('requires a response source object', () => {
    const request = {
      query: { include: ['approximate_count'] },
      response: { source: null }
    };
    const result = Validator.validate(request, options);

    expect(result.error).to.match(/"response.source" must be of type object/);
  });

});
