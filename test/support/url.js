
/**
 * Server port.
 */

var PORT = 8989 || process.env.SOURCERY_PORT;

/**
 * Build an URL address for the integration tests.
 *
 * @returns {String}
 * @api public
 */

module.exports = function(path) {
  path = path || '';
  return 'http://localhost:' + PORT + path;
};

/**
 * Expose `Port`.
 */

module.exports.PORT = PORT;
