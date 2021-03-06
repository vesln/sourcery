/**
 * Test support.
 */

var url = require('../support/url')
  , server = require('../support/server');

/**
 * Subject.
 */

var Resource = require('../../');

describe('RESTful CRUD', function() {
  before(function(done) {
    server.listen(url.PORT, done);
  });

  after(function() {
    server.close();
  });

  var Person = Resource.extend({
    host: url(),
    path: '/people'
  });

  it('can fetch resources by id', function(done) {
    Person.first({ id: 1 }, function(err, person) {
      person.should.be.an.instanceof(Person);
      person.get('id').should.eq(1);
      done();
    });
  });

  it('can fetch all resources', function(done) {
    Person.all(function(err, people) {
      people[0].get().should.eql({ id: 1, name: 'John' });
      people[1].get().should.eql({ id: 2, name: 'Jeff' });
      done();
    });
  });

  it('can update a resource with #update', function(done) {
    var person = new Person({ id: 1 });

    person.set('foo', 'bar');

    person.update({ 'baz': 'test' }, function(err, person) {
      person.get('foo').should.eq('bar');
      person.get('baz').should.eq('test');
      done();
    });
  });

  it('can update a resource with #save', function(done) {
    var person = new Person({ id: 1 });
    person.set('name', 'Ves');

    person.save(function(err, person) {
      person.get('name').should.eq('Ves');
      person.get('_action').should.eq('update');
      done();
    });
  });

  describe('creating a resource', function(done) {
    it('can be created with #save', function(done) {
      var person = new Person;
      person.set('name', 'Jeff');

      person.save(function(err, person) {
        person.get().should.eql({ name: 'Jeff', _action: 'create' })
        done();
      });
    });

    it('can be created with .create', function(done) {
      Person.create({ name: 'Jeff' }, function(err, person) {
        person.get().should.eql({ name: 'Jeff', _action: 'create' });
        done();
      });
    });
  });

  describe('deleting a resource', function() {
    it('can be deleted with #destroy', function(done) {
      var person = new Person({ id: 1 });

      person.destroy(function(err) {
        (err === null).should.be.true;
        done();
      });
    });

    it('can be deleted with .destroy', function(done) {
      Person.destroy(1, function(err) {
        (err === null).should.be.true;
        done();
      });
    });
  });

  describe('nested resource', function() {
    var User = Resource.extend({
      host: url(),
      path: '/projects/:project_id/users'
    });

    it('replaces placeholders with attribute values in order to support nested resources', function(done) {
      User.all({ project_id: 1 }, function(err, users) {
        users.should.have.lengthOf(2);
        done();
      });
    });
  });

  describe('query params', function() {
    var Project = Resource.extend({
      host: url(),
      path: '/projects'
    });

    it('can handle query params', function(done) {
      Project.where('secret', true ).where('auth', true).all(function(err, projects) {
        projects.should.have.lengthOf(2);
        done();
      });
    });
  });
});
