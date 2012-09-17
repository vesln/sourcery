var request = require('request');

function Request(url, attributes) {

};

Request.prototype.create = function() {
  var options = {
    json: this.attributes,
    url: url,
    method: 'POST',
  };
};

module.exports = Request;
