/**
 * Test dependencies.
 */
var chai = require('chai');
var should = chai.should();

/**
 * Subject.
 *
 * @type {Function}
 */
var Resource = require('../../').Resource;
var RequestBuilder = require('../../lib/sourcery/request_builder')

/**
 * Just a dummy fixtures.
 *
 * @type {Function}
 */
var Person = Resource.extend({
  host: 'host',
  path: 'path',
  ext: 'json',
});

describe('Resource', function() {
  it('can return a JSON friendly representation of the data', function() {
    var person = new Person({ name: 'John', age: 39 });
    person.toJSON().should.eql({ name: 'John', age: 39 });
  });

  it('can return a builder', function() {
    var person = new Person({ id: 1 });
    var builder = person.builder();

    builder.should.be.an.instanceof(RequestBuilder);
    builder.host().should.eql('host');
    builder.path().should.eql('path');
    builder.ext().should.eql('json');
    builder.attributes().should.eql({ id: 1 });
  });
});
