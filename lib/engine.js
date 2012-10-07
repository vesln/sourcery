var request = require('request');

var engine = {};

engine.exec = function(options, fn) {
  this.request(options, function(err, res, body) {
    fn(err, body);
  });
};

engine.request = function() {
  return request.apply(request, arguments);
};

module.exports = engine;
