var chai = require('chai');
var should = chai.should();
var Resource = require('../').Resource;
var server = require('./support/server');

// TODO: move to a url helper
var PORT = 8989;

describe('RESTful CRUD', function() {
  before(function(done) {
    server.listen(PORT, done);
  });

  after(function(done) {
    server.close(done);
  });

  var Person = Resource.extend({
    url: 'http://localhost:' + PORT + '/people'
  });

  it('can fetch resources by id', function(done) {
    Person.first(1, function(err, person) {
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

  it('can update a resource', function(done) {
    var person = new Person({ id: 1 });

    person.set('foo', 'bar');
    person.update({ 'baz': 'test' }, function(err, person) {
      person.get('foo').should.eq('bar');
      person.get('baz').should.eq('test');
      done();
    });
  });

  describe('creating a resource', function(done) {
    it('can be created with #save', function(done) {
      var person = new Person;
      person.set('name', 'Jeff');

      person.save(function(err, person) {
        person.get().should.eql({ name: 'Jeff' })
        done();
      });
    });

    it('can be created with .create', function(done) {
      Person.create({ name: 'Jeff' }, function(err, person) {
        person.get().should.eql({ name: 'Jeff' })
        done();
      });
    });
  });

  describe('deleting a resource', function() {
    it('can be deleted with #destroy', function(done) {
      var person = new Person({ id: 1 });

      person.destroy(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('can be deleted with .destroy', function(done) {
      Person.destroy(1, function(err) {
        should.not.exist(err);
        done();
      });
    });
  });
});
