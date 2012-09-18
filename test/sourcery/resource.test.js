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

/**
 * Just a dummy fixtures.
 *
 * @type {Function}
 */
var Person = Resource.extend();

describe('Resource', function() {
  it('can return a JSON friendly representation of the data', function() {
    var person = new Person({ name: 'John', age: 39 });
    person.toJSON().should.eql({ name: 'John', age: 39 });
  });
});
