function BasicAuth(credentials) {
  this.credentials = credentials;
};

BasicAuth.prototype.authenticate = function(options) {
  var credentials = this.credentials;
  var hash = new Buffer(credentials.user + ':' + credentials.pass).toString('base64');

  options.headers = options.headers || {};
  options.headers['Authorization'] = 'Basic ' + hash;

  return options;
};

module.exports = BasicAuth;
