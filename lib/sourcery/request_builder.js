function RequestBuilder(type) {
  this._type = type;
  this._attributes = {};
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

RequestBuilder.prototype.ext = function(ext) {
  if (arguments.length === 0) {
    return this._ext;
  }

  this._ext = ext;
  return this;
};

RequestBuilder.prototype.query = function(query) {
  if (arguments.length === 0) {
    return this._query;
  }

  this._query = query;
  return this;
};

RequestBuilder.prototype.auth = function(auth) {
  if (arguments.length === 0) {
    return this._auth;
  }

  this._auth = auth;
  return this;
};

RequestBuilder.prototype.build = function() {
  var options = {};
  var url = this.host() + this.path();
  var attributes = this.attributes();
  var ext = this.ext();
  var query = this.query();
  var auth = this.auth();

  Object.keys(attributes).forEach(function(name) {
    url = url.replace(':' + name, attributes[name]);
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

    default:
      throw new Error('Invalid type: ' + type);
  }


  if (ext) options.url += '.' + ext;

  // TODO: fix me
  if (query) options.qs = query;
  if (auth) options = auth.authenticate(options);

  return options;
};

module.exports = RequestBuilder;
