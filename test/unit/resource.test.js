
/**
 * Subject.
 */

var Resource = require('../../');

/**
 * Subject dependencies.
 */

var RequestBuilder = require('../../lib/request_builder')

/**
 * Just a dummy fixtures.
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
