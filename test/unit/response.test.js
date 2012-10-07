
/**
 * Subject.
 */

var Response = require('../../').Response;

describe('Response', function() {
  it('does not return an error when the status code is acceptable', function() {
    var success = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
      , response = null;

    success.forEach(function(code) {
      response = new Response(null, { statusCode: code });
      (response.error() === null).should.be.true;
    });
  });

  it('returns an error when the status is bad', function() {
    var err = new Response(null, { statusCode: 500 }).error();

    err.should.be.an.instanceof(Error);
    err.message.should.eq('Received bad status code: 500');
  });

  it('returns the engine error if any', function() {
    var response = new Response(new Error());
    response.error().should.be.an.instanceof(Error);
  });

  it('can return the reponse body', function() {
    var response = new Response(null, { body: 'BODY' });
    response.body().should.eq('BODY');
  });
});
