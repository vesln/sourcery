[![Build Status](https://secure.travis-ci.org/vesln/sourcery.png)](http://travis-ci.org/vesln/sourcery)

# Sourcery

Sourcery is a framework for building RESTful API clients. It's heavily
inspired by
[ActiveResource](https://github.com/rails/activeresoucre) and behaves almost the
same way. It's blazing fast and extremely simple to use.

## Synopsis

### Defining resources

```js
var Resource = require('sourcery');

var Base = Resource.extend({
  host: 'http://example.com/api/v1', // base host
  ext:  'json',                      // optional, will include `.json` in the URLs
  root: true,                        // optional, will include root element
});

var Project = Base.extend({
  path: '/projects', // http://example.com/api/v1/projects
  name: 'Project',   // optional, this is the name for the root element
});
```

### CRUD

Find one:

```js
Project.first({ id: 1 }, function(err, project) {
  project.get('name');
  project.get('id');
});
```

Find many:

```js
Project.all({ user_id: 1 }, function(err, projects) {
  projects[0].get('user_id');
  projects[1].get('user_id');
});
```

Create:

```js
var project = new Project;
project.set('name', 'Top secret');

project.save(function(err, project) {
  console.log(project);
});
```

```js
Project.create({ name: 'Secret' }, function(err, project) {
  console.log(project);
});
```

Update:

```js
var project = new Project({ id: 1 });
project.set('name', 'New name');

project.save(function(err, project) {
  console.log(project);
});
```

Destroy:

```js
Project.destroy(1, function(err) {
  // done;
});
```

```js
var project = new Project({ id: 1 });

project.destroy(function(err) {
  // done
});
```

Include params:

```js
Project
  .where('page', 1)
  .where('limit', 3)
  .all(function(err, projects) {
    console.log(projects);
  });
```

### Nested resources

```js
var Task = Base.extend({
  path: '/projects/:project_id/tasks',
});
```

Sourcery will replace the placeholders, in this example ":project_id",
with the matching attribute.

### Basic Auth

```js
var BasicAuth = require('sourcery').BasicAuth;

var Base = Resource.extend({
  host: 'http://example.com/api/v1',
  auth: {
    type:  BasicAuth,
    user: 'replace-with-real-user',
    pass: 'replace-with-real-pass'
  }
});
```

### Wait, but what about...

Please open an issues if you have feature requests. Thanks!

## Install

```
$ npm install sourcery
```

## Requirements

- Node.js >= 0.6.0

## Tests

```
$ npm install
$ make test
```

## Real world examples

- [aero.io API client](https://github.com/aeroio/node-client/blob/master/lib/client.js)

## TODO

- More examples
- Fake Engine
- Custom endpoints
- Schema
- Associations
- Validations
- Test helpers
- XML
- Custom error classes
- Resource.member()

## License

MIT License

Copyright (C) 2012 Veselin Todorov (hi@vesln.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
