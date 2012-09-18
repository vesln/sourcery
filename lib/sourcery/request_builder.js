function RequestBuilder(type) {
  this._type = type;
  this._attributes = null;
  this._params = {};
};

RequestBuilder.prototype.type = function(type) {
  if (arguments.length === 0) {
    return this._type;
  }

  this._type = type;
  return this;
};

RequestBuilder.prototype.attributes = function(attributes) {
  if (arguments.length === 0) {
    return this._attributes;
  }

  this._attributes = attributes;
  return this;
};

RequestBuilder.prototype.host = function(host) {
  if (arguments.length === 0) {
    return this._host;
  }

  this._host = host;
  return this;
};

RequestBuilder.prototype.path = function(path) {
  if (arguments.length === 0) {
    return this._path;
  }

  this._path = path;
  return this;
};

RequestBuilder.prototype.params = function(params) {
  if (arguments.length === 0) {
    return this._params;
  }

  this._params = params;
  return this;
};

RequestBuilder.prototype.ext = function(ext) {
  if (arguments.length === 0) {
    return this._ext;
  }

  this._ext = ext;
  return this;
};

RequestBuilder.prototype.build = function() {
  var options = {};
  var url = this.host() + this.path();
  var params = this.params();
  var attributes = this.attributes();
  var ext = this.ext();

  Object.keys(params).forEach(function(param) {
    url = url.replace(':' + param, params[param]);
  });

  options.url = url;

  switch (this.type()) {
    case 'create':
      options.method = 'POST';
      options.json = attributes;
      break;

    case 'update':
      options.method = 'PUT';
      options.url += '/' + attributes.id;
      options.json = attributes;
      break;

    case 'delete':
      options.method = 'DELETE';
      options.url += '/' + attributes.id;
      options.json = true;
      break;

    case 'all':
      options.method = 'GET';
      options.json = true;
      break;

    case 'one':
      options.method = 'GET';
      options.url += '/' + attributes.id;
      options.json = true;
      break;
  }

  if (ext) options.url += '.' + ext;

  return options;
};

module.exports = RequestBuilder;
