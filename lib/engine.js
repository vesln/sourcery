/**
 * External dependencies.
 */

var request = require('request');

/**
 * Internal dependencies.
 */

var Response = require('./response');

/**
 * Small request wrapper. Nothing fancy.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

module.exports = function(options, fn) {
  request(options, function(err, res, body) {
    fn(new Response(err, res));
  });
};
