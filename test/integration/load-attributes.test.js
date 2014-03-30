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

describe('Load attributes after save', function() {
  before(function(done) {
    server.listen(url.PORT, done);
  });

  after(function() {
    server.close();
  });

  it('parses correctly the response', function(done) {
    var door = new Door({ foo: 'bar' });

    door.save(function(err) {
      door.get('id').should.eq(1);
      done();
    });
  });
});
