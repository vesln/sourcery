/**
 * Expose `Resource`.
 */
module.exports = require('./sourcery/resource');

/**
 * Sourcery version.
 *
 * @type {String}
 */
module.exports.version = require('../package.json').version;

/**
 * Expose `BasicAuth`.
 */
module.exports.BasicAuth = require('./sourcery/basic_auth');
