/**
 * Exports.
 */

module.exports = require('./resource');
module.exports.version = require('../package.json').version;
module.exports.BasicAuth = require('./basic-auth');
module.exports.Response = require('./response');
module.exports.RequestBuilder = require('./request-builder');
