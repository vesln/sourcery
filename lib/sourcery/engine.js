var request = require('request');

var engine = {};

engine.exec = function(options, fn) {
  request(options, fn);
};

module.exports = engine;
