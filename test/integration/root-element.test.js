/**
 * Test support.
 */

var url = require('../support/url')
  , server = require('../support/server');

/**
 * Subject.
 */

var Resource = require('../../')
  , BasicAuth = require('../../').BasicAuth;

/**
 * Fixtures.
 */

var Door = Resource.extend({
  host: url(),
  path: '/doors',
  name: 'Door',
  root: true
});

describe('Include root element', function() {
  before(function(done) {
    server.listen(url.PORT, done);
  });

  after(function() {
    server.close();
  });

  it('includes root element on #toJSON', function() {
    var door = new Door({ foo: 'bar' });
    door.toJSON().should.eql({ 'door': { foo: 'bar' } });
  });

  it('includes root element when sending a request', function(done) {
    var door = new Door({ foo: 'bar' });

    door.save(function(err, door) {
      (err === null).should.be.true;
      done();
    });
  });

  it('parses correctly the response', function(done) {
    var door = new Door({ foo: 'bar' });

    door.save(function(err, door) {
      door.get('foo').should.eq('bar');
      done();
    });
  });
});
