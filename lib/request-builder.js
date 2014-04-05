/**
 * Request Builder.
 *
 * @param {String} type
 * @constructor
 */

function RequestBuilder(type) {
  this._type       = type;
  this._params     = {};
  this._attributes = {}
};

/**
 * Register accessors.
 */

var accessors = [
  'type',
  'attributes',
  'host',
  'path',
  'ext',
  'query',
  'auth'
];

accessors.forEach(function(name) {
  RequestBuilder.prototype[name] = function(val) {
    if (arguments.length === 0) return this['_' + name];
    this['_' + name] = val;
    return this;
  };
});

/**
 * Request type -> HTTP verb
 *
 * @type {Object}
 * @api private
 */

RequestBuilder.prototype.verbs = {
  all:    'GET',
  one:    'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE',
};

/**
 * Build an HTTP request options.
 *
 * @returns {Object}
 * @api public
 */

RequestBuilder.prototype.build = function() {
  var options = {}
    , qs = null;

  options.url    = this.url();
  options.method = this.method();
  options.json   = this.json();
  qs             = this.query();

  if (qs)  {
    options.qs = qs;
  }

  return this.authenticate(options);
};

/**
 * Return the HTTP method based on the request type.
 *
 * @returns {String}
 * @api private
 */

RequestBuilder.prototype.method = function() {
  var method = this.verbs[this._type];
  if (!method) throw new Error('Invalid type: "' + this._type +'"');
  return method;
};

/**
 * Append authentication options if an authenticator is provided.
 *
 * @param {Object} options
 * @returns {Object} options
 * @api privae
 */

RequestBuilder.prototype.authenticate = function(options) {
  var auth = this.auth();
  if (auth) options = auth.authenticate(options);
  return options;
};

/**
 * Return JSON option for the engine.
 *
 * @returns {Boolean|Object}
 * @api private
 */

RequestBuilder.prototype.json = function() {
  if (this._type === 'create' || this._type === 'update') {
    return this.attributes();
  }

  return true;
};

/**
 * Return the URL address of the request.
 *
 * @returns {String}
 * @api private
 */

RequestBuilder.prototype.url = function() {
  var url   = this.host() + this.path()
    , attrs = this.attributes()
    , id    = attrs.id ? '/' + attrs.id : ''
    , ext   = this.ext() ? '.' + this.ext() : '';

  Object.keys(attrs).forEach(function(name) {
    url = url.replace(':' + name, attrs[name]);
  });

  url += id;
  url += ext;

  return url;
};

/**
 * Expose `RequestBuilder`
 */

module.exports = RequestBuilder;
