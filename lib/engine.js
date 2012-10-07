
/**
 * External dependencies.
 */

var request = require('request');

/**
 * Small request wrapper. Nothing fancy.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

module.exports = function(options, fn) {
  request(options, function(err, res, body) {
    fn(err, body);
  });
};
