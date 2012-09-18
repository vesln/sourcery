/**
 * Super inheritor.
 *
 * @type {Object}
 */
var cuper = require('super');

/**
 * No operation.
 *
 * @type {Function}
 */
var noop = function() {};

var RequestBuilder = require('./request_builder');
var engine = require('./engine');

/**
 * # Resource
 *
 * Base resource that one should inherit from.
 *
 * @param {Object} attributes to be set
 * @name constructor
 * @api public
 */
function Resource(attributes) {
  this.attributes = attributes || {};
};

/**
 * # #get()
 *
 * Return a property value.
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
 * # #set()
 *
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
 * # #create()
 *
 * Create a new resource. Internal use only.
 *
 * @param {Function} callback
 * @api private
 */
Resource.prototype.create = function(fn) {
  var fn = fn || noop;

  this.query('create', function(err, res, body) {
    fn(err, this.factory(body));
  }.bind(this));
};

/**
 * # #update(params, fn)
 *
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

  this.query('update', function(err, res, body) {
    fn(err, this.factory(body));
  }.bind(this));
};

/**
 * # #update(fn)
 *
 * Delete a resource.
 *
 * @param {Function} callback
 * @api public
 */
Resource.prototype.destroy = function(fn) {
  this.query('delete', function(err, res, body) {
    fn(err);
  });
};

/**
 * # #save(fn)
 *
 * Save or update a resource, depending on if
 * an ID is present or not.
 *
 * @param {Function} callback
 * @api public
 */
Resource.prototype.save = function(fn) {
  var id = this.get('id');

  if (id) {
    this.update(this.attributes, fn);
  } else {
    this.create(fn);
  }
};

/**
 * # #sync(fn)
 *
 * Sync data with the remote server. This will override any
 * previous changes.
 *
 * @param {Function} callback
 * @api private
 */
Resource.prototype.sync = function(fn) {
  this.query('one', function(err, res, body) {
    fn(err, this.factory(body));
  }.bind(this));
};

Resource.prototype.all = function(fn) {
  this.query('all', function(err, res, body) {
    fn(err, this.factory(body));
  }.bind(this));
};

Resource.prototype.query = function(type, fn) {
  var builder = this.builder();
  var options = builder.type(type).build();

  this.engine().exec(options, fn);
};

Resource.prototype.engine = function() {
  return engine;
};

Resource.prototype.builder = function() {
  var builder = new RequestBuilder;

  return builder
    .host(this.host)
    .path(this.path)
    .attributes(this.attributes)
    .ext(this.ext);
};

/**
 * # #toJSON()
 *
 * Return a JSON friendly representation of the object.
 *
 * @returns {Object}
 * @api public
 */
Resource.prototype.toJSON = function() {
  return this.attributes;
};

/**
 * # Resource.create(attributes, fn)
 *
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
 * # Resource.destroy(id, fn)
 *
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
 * # Resource.first(id, fn)
 *
 * Fetch a resource by ID.
 *
 * @param {String|Number} id
 * @param {Function} callback
 * @api public
 */
Resource.first = function(conditions, fn) {
  new this(conditions).sync(fn);
};

/**
 * # Resource.find()
 *
 * Alias of first.
 */
Resource.find = Resource.first;

/**
 * # Resource.all
 *
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
 *
 * @returns {Function}
 * @api private
 */
Resource.prototype.factory = function(attributes) {
  if (Array.isArray(attributes)) {
    return attributes.map(function(obj) {
      return this.init(obj)
    }.bind(this));
  }

  return this.init(attributes);
};

Resource.prototype.init = function(attributes) {
  return new this.constructor(attributes);
};

/**
 * # Resource.extend({ url: 'http://google.com' });
 *
 * The resources should extend `Resource`.
 *
 * @returns {Resource} the new resource
 * @api public
 */
Resource.extend = cuper.extend;

/**
 * Expose `Resource`
 */
module.exports = Resource;
