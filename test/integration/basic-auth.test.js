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

var Repo = Resource.extend({
  host: url(),
  path: '/repos',
  auth: { type: BasicAuth, user: 'user', pass: 'pass' }
});

describe('Basic Auth', function() {
  before(function(done) {
    server.listen(url.PORT, done);
  });

  after(function() {
    server.close();
  });

  it('can handle basic access authentication', function(done) {
    Repo.all(function(err, repos) {
      repos.should.have.lengthOf(2);
      done();
    });
  });
});
