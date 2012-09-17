var request = require('request');

/**
 * Super inheritor.
 *
 * @type {Object}
 */
var cuper = require('super');

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
  // TODO: probably should throw if not found
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
  var klass = this.klass()
  var url = this.uri() + '/';

  var options = {
    json: this.attributes,
    url: url,
    method: 'POST',
  };

  request(options, function(err, res, body) {
    var obj = new klass(body);
    fn(err, obj);
  });
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
  var dis = this;

  if (arguments.length === 2) {
    this.attributes = cuper.merge([this.attributes, attributes]);
  } else {
    fn = attributes;
  }

  var klass = this.klass();
  var url = this.uri() + '/' + this.get('id');

  var options = {
    json: this.attributes,
    url: url,
    method: 'PUT',
  };

  request(options, function(err, res, body) {
    var obj = new klass(body);
    fn(err, obj);
  });
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
  var url = this.uri() + '/' + this.get('id')

  var options = {
    method: 'DELETE',
    json: true,
    url: url
  };

  request(options, function(err, res, body) {
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
  var klass = this.klass();
  var url = this.uri() + '/' + this.get('id');

  var options = {
    json: true,
    url: url
  };

  request(options, function(err, res, body) {
    var object = new klass(body);
    fn(err, object);
  });
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
Resource.first = function(id, fn) {
  new this({ id: id }).sync(fn);
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
Resource.all = function(fn) {
  var self = this;
  var url = this.uri();

  var options = {
    json: true,
    url: url
  };

  request(options, function(err, res, body) {
    var objects = body.map(function(object) { return new self(object); });
    fn(err, objects);
  });
};

Resource.prototype.uri = function() {
  return this.klass().uri();
};

/**
 * # #klass()
 *
 * Return the current class.
 *
 * @returns {Function}
 * @api private
 */
Resource.prototype.klass = function() {
  return this.constructor;
};

/**
 * # #uri()
 *
 * Build the resource url.
 *
 * @returns {String}
 * @api private
 */
Resource.uri = function() {
  return this.url;
};

/**
 * # Resource.extend({ url: 'http://google.com' });
 *
 * The resources should extend `Resource`.
 *
 * @returns {Resource} the new resource
 * @api public
 */
Resource.extend = function(klass) {
  var self = this;
  var child = function () { return self.apply(this, arguments); };

  cuper.merge([ child, this ]);
  cuper.inherits(child, this);

  if (klass) {
    cuper.merge([ child, klass ]);
  }

  child.extend = this.extend;

  return child;
};

/**
 * Expose `Resource`
 */
module.exports = Resource;
