var Resource = require('..');
var BasicAuth = require('..').BasicAuth;

var Base = Resource.extend({
  host: 'http://localhost:3000/api/v1',
  ext: 'json',
  auth: {
    type:  BasicAuth,
    user: '5ea983e97362a95c20b0491cb78cc633',
    pass: '2e0f80f0472dd73843fd882a1944e62d'
  }
});

var Project = Base.extend({
  path: '/projects'
});

var Error = Base.extend({
  path: '/projects/:project_id/errors'
});

Error.all({ project_id: 1 }, function(err, projects) {
  console.log(projects[0]);
});
