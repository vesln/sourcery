
/**
 * Expose `Resource`.
 */

module.exports = require('./resource');

/**
 * Sourcery version.
 */

module.exports.version = require('../package.json').version;

/**
 * Expose `BasicAuth`.
 */

module.exports.BasicAuth = require('./basic-auth');

/**
 * Expose `Response`
 */

module.exports.Response = require('./response');

/**
 * Expose `RequestBuilder`
 */

module.exports.RequestBuilder = require('./request-builder');
