var express = require('express');
var app = express.createServer();

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

module.exports = app;
