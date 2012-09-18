function BasicAuth(credentials) {
  this.credentials = credentials;
};

BasicAuth.prototype.authenticate = function(options) {
  var hash = new Buffer(this.credentials.user + ':' + this.credentials.pass).toString('base64');
  options.headers = { 'Authorization': 'Basic ' + hash };
  return options;
};

module.exports = BasicAuth;
