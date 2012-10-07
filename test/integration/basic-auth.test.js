
/**
 * Test support.
 */

var server = require('../support/server');
var url = require('../support/url');

/**
 * Subject.
 */

var Resource = require('../../');
var BasicAuth = require('../../').BasicAuth;

/**
 * Fixtures.
 */

var Repo = Resource.extend({
  host: url(),
  path: '/repos',
  auth: { type: BasicAuth, user: 'user', pass: 'pass' }
});

describe('Basic auth', function() {
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
