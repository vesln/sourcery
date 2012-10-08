
/**
 * External dependencies.
 */

var express = require('express')
  , app = express.createServer();

/**
 * Basic auth middleware.
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next middleware
 */

function basicAuth(req, res, next) {
  var auth = req.headers.authorization.split(' ')[1]
    , credentials = new Buffer(auth, 'base64').toString().split(':');

  if (credentials[0] === 'user' && credentials[1] === 'pass') {
    return next();
  }

  throw new Error('Invalid or missing credentials');
};

app.configure(function() {
  app.use(express.bodyParser());
});

app.get('/people/:id', function(req, res) {
  res.json({ id: 1 })
});

app.get('/people', function(req, res) {
  res.json([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jeff' },
  ]);
});

app.post('/people', function(req, res) {
  req.body._action = 'create';
  res.json(req.body);
});

app.put('/people/:id', function(req, res) {
  req.body._action = 'update';
  res.json(req.body);
});

app.del('/people/:id', function(req, res) {
  res.end();
});

app.get('/projects/:project_id/users', function(req, res) {
  res.json([{ name: 'John' }, { name: 'Jeff' }]);
});

app.get('/projects', function(req, res) {
  if (req.query.secret === 'true' && req.query.auth === 'true') {
    res.json([{ name: 'John' }, { name: 'Jeff' }]);
  }
});

app.get('/repos', basicAuth, function(req, res) {
  res.json([{ name: 'github' }, { name: 'google' }]);
});

app.post('/doors', function(req, res) {
  var hasRoot = !!req.body.door;

  if (!hasRoot) {
    throw new Error('The request body should include a root element');
  }

  res.json(req.body);
});

/**
 * Expose `app`.
 */

module.exports = app;
