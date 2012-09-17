/**
 * Resource.
 *
 * @type {Function}
 */
var Resource = require('./sourcery/resource');

/**
 * Sourcery version.
 *
 * @type {String}
 */
module.exports.version = require('../package.json').version;

/**
 * Expose `Resource`.
 */
module.exports.Resource = Resource;
