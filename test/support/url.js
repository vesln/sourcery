var PORT = 8989 || process.env.SOURCERY_PORT;

module.exports = function(path) {
  return 'http://localhost:' + PORT + path;
};

module.exports.PORT = PORT;
