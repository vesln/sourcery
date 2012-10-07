function BasicAuth(credentials) {
  this.credentials = credentials;
};

BasicAuth.prototype.authenticate = function(options) {
  options.headers = options.headers || {};
  options.headers['Authorization'] = 'Basic ' + this.hash();

  return options;
};

BasicAuth.prototype.hash = function() {
  return new Buffer(this.credentials.user + ':' + this.credentials.pass)
    .toString('base64');
};

module.exports = BasicAuth;
