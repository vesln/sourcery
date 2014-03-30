/**
 * Response.
 *
 * @param {Object} error from the engine
 * @param {Object} engine response
 * @constructor
 */

function Response(err, res) {
  this.err     = err;
  this.res     = res;
  this.success = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
};

/**
 * Return the response error, if any.
 *
 * @returns {Object}
 * @api public
 */

Response.prototype.error = function() {
  return this.err || this.extractError(this.res);
};

/**
 * Return the response body.
 *
 * @returns {Object}
 * @api public
 */

Response.prototype.body = function() {
  return this.res.body;
};

/**
 * Check if the status code is not acceptable
 * and consturct an error if so.
 *
 * @param {Object} engine response
 * @api private
 */

Response.prototype.extractError = function(res) {
  if (~this.success.indexOf(res.statusCode)) {
    return null;
  }

  return new Error('Received bad status code: ' + res.statusCode);
};

/**
 * Expose `Response`
 */

module.exports = Response;
