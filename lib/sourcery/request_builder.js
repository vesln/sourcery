function RequestBuilder(type) {
  this.data = {
    type: type,
    attributes: {},
    params: {}
  };

  this._attributes = {};
  this._params = {};
};

['type', 'attributes', 'host', 'path', 'ext', 'query', 'auth'].forEach(function(name) {
  RequestBuilder.prototype[name] = function(val) {
    if (arguments.length === 0) {
      return this.data[name];
    }

    this.data[name] = val;
    return this;
  };
});

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
  if (query) options.qs = query;
  if (auth) options = auth.authenticate(options);

  return options;
};

module.exports = RequestBuilder;
