/**
 * External dependencies.
 */

var cuper = require('super');

/**
 * Internal dependencies.
 */

var RequestBuilder = require('./request-builder')
  , engine = require('./engine');

/**
 * No operation.
 *
 * @type {Function}
 */

var noop = function() {};

/**
 * Base resource. All resources inherit from it.
 *
 * @param {Object} attributes to be set
 * @constructor
 */

function Resource(attributes) {
  this.engine = engine;
  this.name = !this.name ? this.name : this.name.toLowerCase();
  this.queryParams = {};
  this.attributes = {};
  this.load(attributes || {});
};

/**
 * Load the given attributes.
 *
 * @param {Object} attributes, with or without root element.
 * @api private
 */

Resource.prototype.load = function(attrs) {
  if (Object.keys(attrs).length === 0) {
    return;
  } else if (this.root === true && Object(attrs[this.name]) === attrs[this.name]) {
    this.attributes = attrs[this.name];
  } else {
    this.attributes = attrs;
  }
};

/**
 * Attribute reader.
 *
 * @param {String} attribute name
 * @returns {Mixed}
 * @api public
 */

Resource.prototype.get = function(attribute) {
  if (arguments.length === 0) {
    return this.attributes;
  }

  return this.attributes[attribute];
};

/**
 * Attribute writter.
 *
 * @param {String} attribute name
 * @param {Mixed} value
 * @returns {Resource} this
 * @api public
 */

Resource.prototype.set = function(attribute, value) {
  this.attributes[attribute] = value;
  return this;
};

/**
 * Create a new resource. Internal use only.
 *
 * @param {Function} callback
 * @api private
 */

Resource.prototype.create = function(fn) {
  var fn = fn || noop;

  this.query('create', function(err, body) {
    if (!err) this.load(body);
    fn(err, this.factory(body));
  }.bind(this));
};

/**
 * Update a resource. You can supply multiple attributes that
 * are going to be presented in the request, among with the others set
 * previously.
 *
 * @param {Object} attributes
 * @param {Function} callback
 * @api public
 */

Resource.prototype.update = function(attributes, fn) {
  if (arguments.length === 2) {
    this.attributes = cuper.merge([this.attributes, attributes]);
  } else {
    fn = attributes;
  }

  fn = fn || noop;

  this.query('update', function(err, body) {
    if (!err) this.load(body);
    fn(err, this.factory(body));
  }.bind(this));
};

/**
 * Delete a resource.
 *
 * @param {Function} callback
 * @api public
 */

Resource.prototype.destroy = function(fn) {
  var fn = fn || noop;

  this.query('delete', function(err, body) {
    fn(err);
  });
};

/**
 * Save or update a resource, depending on if
 * an ID is present or not.
 *
 * @param {Function} callback
 * @api public
 */

Resource.prototype.save = function(fn) {
  if (this.get('id')) {
    this.update(this.attributes, fn);
  } else {
    this.create(fn);
  }
};

/**
 * Sync data with the remote server. This will override any
 * previous changes.
 *
 * @param {Function} callback
 * @api private
 */

Resource.prototype.sync = function(fn) {
  var fn = fn || noop;

  this.query('one', function(err, body) {
    if (!err) {
      this.load(body);
      fn(err, this.factory(body));
    } else {
      fn(err,body);
    }
  }.bind(this));
};

/**
 * Return all resources.
 *
 * @param {Function} callback
 * @api private
 */

Resource.prototype.all = function(fn) {
  var fn = fn || noop;

  this.query('all', function(err, body) {
    fn(err, this.factory(body));
  }.bind(this));
};


/**
 * Trigger an HTTP query.
 *
 * @param {String} type - all, one, create, update, delete
 * @param {Function} callback
 * @api private
 */

Resource.prototype.query = function(type, fn) {
  var builder = this.builder().type(type)
    , request = null
    , klass = null;

  if (this.auth) {
    klass = this.auth.type;
    delete this.auth.type;
    builder.auth(new klass(this.auth));
  }

  request = builder.build();

  this.engine(request, function(res) {
    fn(res.error(), res.body());
  });
};

/**
 * Append a where condition to the query
 *
 * @param {String} name
 * @param {Mixed} value
 * @api public
 */

Resource.prototype.where = function(param, value) {
  this.queryParams[param] = value;
  return this;
};

/**
 * Construct a new `RequestBuilder`.
 *
 * @returns {RequestBuilder}
 * @api private
 */

Resource.prototype.builder = function() {
  return (new RequestBuilder)
    .host(this.host)
    .query(this.queryParams)
    .path(this.path)
    .attributes(this.attrs())
    .ext(this.ext);
};

/**
 * Return the attributes with or without
 * root element.
 *
 * @returns {Object}
 * @api private
 */

Resource.prototype.attrs = function() {
  var attrs = this.attributes
    , json = {};

  if (this.root !== true) {
    return attrs;
  }

  json[this.name] = attrs;
  return json;
};

/**
 * Return a JSON friendly representation of the object.
 *
 * @returns {Object}
 * @api public
 */

Resource.prototype.toJSON = function() {
  return this.attrs();
};

/**
 * Create a new resource. This will sync the data with
 * the server.
 *
 * @param {Object} attributes
 * @param {Function} callback
 * @api public
 */

Resource.create = function(attributes, fn) {
  new this(attributes).create(fn);
};

/**
 * Delete a resource.
 *
 * @param {String|Number} ID
 * @param {Function} callback
 * @api public
 */

Resource.destroy = function(id, fn) {
  new this({ id: id }).destroy(fn);
};

/**
 * Fetch the first matched resource.
 *
 * @param {String|Number} id
 * @param {Function} callback
 * @api public
 */

Resource.first = function(conditions, fn) {
  new this(conditions).sync(fn);
};

/**
 * Append a condition.
 *
 * @param {String} name
 * @param {Mixed} value
 * @api public
 */

Resource.where = function(param, value) {
  return (new this).where(param, value);
};

/**
 * An alias of first.
 *
 * @api public
 */

Resource.find = Resource.first;

/**
 * Return all available resources.
 *
 * @param {Function} callback
 * @api public
 */

Resource.all = function(conditions, fn) {
  if (arguments.length === 1) {
    fn = conditions;
    conditions = {};
  }

  new this(conditions).all(fn);
};

/**
 * Resource(s) factory.
 *
 * @param {Object|Array} attributes or array of attributes
 * @returns {Function}
 * @api private
 */

Resource.prototype.factory = function(attributes) {
  if (Array.isArray(attributes)) {
    return attributes.map(function(obj) {
      return this.init(obj)
    }, this);
  }

  return this.init(attributes);
};

/**
 * Construct a new instance with the given attributes.
 *
 * @param {Object} attributes
 * @returns {Resource}
 * @api private
 */

Resource.prototype.init = function(attributes) {
  return new this.constructor(attributes);
};

/**
 * Extend the base `Resource`.
 *
 * @returns {Resource} the new resource
 * @api public
 */

Resource.extend = cuper.extend;

/**
 * Expose `Resource`
 */

module.exports = Resource;
