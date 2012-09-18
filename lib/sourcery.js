/**
 * Sourcery version.
 *
 * @type {String}
 */
module.exports.version = require('../package.json').version;

/**
 * Expose `Resource`.
 */
module.exports.Resource = require('./sourcery/resource');

/**
 * Expose `BasicAuth`.
 */
module.exports.BasicAuth = require('./sourcery/basic_auth');
