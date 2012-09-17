var request = require('request');
var inherits = require('super');

function Resource(attributes) {
  this.attributes = attributes || {};
};

Resource.prototype.get = function(attribute) {
  if (arguments.length === 0) {
    return this.attributes;
  }
  // TODO: probably should throw if not found
  return this.attributes[attribute];
};

Resource.prototype.set = function(attribute, value) {
  this.attributes[attribute] = value;
};

Resource.prototype.save = function(fn) {
  var self = this.constructor;
  var url = this.url + '/';

  var options = {
    json: this.attributes,
    url: url,
    method: 'POST',
  };

  request(options, function(err, res, body) {
    var obj = new self(body);
    fn(err, obj);
  });
};

Resource.prototype.update = function(attributes, fn) {
  var dis = this;

  if (arguments.length === 2) {
    this.attributes = inherits.merge([this.attributes, attributes]);
  } else {
    fn = attributes;
  }

  var self = this.constructor;
  var url = this.url + '/' + this.get('id');

  var options = {
    json: this.attributes,
    url: url,
    method: 'PUT',
  };

  request(options, function(err, res, body) {
    var obj = new self(body);
    fn(err, obj);
  });
};

Resource.prototype.destroy = function(fn) {
  var self = this;
  var url = this.url + '/' + this.get('id')

  var options = {
    method: 'DELETE',
    json: true,
    url: url
  };

  request(options, function(err, res, body) {
    fn(err);
  });
};

Resource.create = function(attributes, fn) {
  delete attributes.id;
  var resource = new this(attributes);
  resource.save(fn);
};

Resource.destroy = function(id, fn) {
  var resource = new this({ id: id });
  resource.destroy(fn);
};

// TODO: handle errors
Resource.first = function(id, fn) {
  var self = this;
  var url = this.url() + '/' + id;

  var options = {
    json: true,
    url: url
  };

  request(options, function(err, res, body) {
    var object = new self(body);
    fn(err, object);
  });
};

// TODO: handle errors
Resource.all = function(fn) {
  var self = this;
  var url = this.url();

  var options = {
    json: true,
    url: url
  };

  request(options, function(err, res, body) {
    var objects = body.map(function(object) { return new self(object); });
    fn(err, objects);
  });
};

Resource.url = function() {
  return this.prototype.url;
};

Resource.extend = inherits.extend;

module.exports.Resource = Resource;
