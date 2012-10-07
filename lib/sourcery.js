
/**
 * Expose `Resource`.
 */

module.exports = require('./resource');

/**
 * Sourcery version.
 *
 * @type {String}
 */

module.exports.version = require('../package.json').version;

/**
 * Expose `BasicAuth`.
 */

module.exports.BasicAuth = require('./basic_auth');
