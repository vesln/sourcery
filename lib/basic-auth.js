/**
 * `BasicAuth` Authenticator.
 *
 * @param {Object} credentials
 * @constructor
 */

function BasicAuth(credentials) {
  this.user = credentials.user;
  this.pass = credentials.pass;
};

/**
 * Append authentication options. This behavior is sketchy.
 *
 * @param {Object} options
 * @returns {Object} options
 * @api public
 */

BasicAuth.prototype.authenticate = function(options) {
  options.headers = options.headers || {};
  options.headers['Authorization'] = 'Basic ' + this.encode();

  return options;
};

/**
 * Build the base64 hash.
 *
 * @returns {String}
 * @api private
 */

BasicAuth.prototype.encode = function() {
  return new Buffer(this.user + ':' + this.pass).toString('base64');
};

/**
 * Expose `BasicAuth`.
 */

module.exports = BasicAuth;
