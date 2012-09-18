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
var Builder = require('../../lib/sourcery/request_builder')

describe('RequestBuilder', function() {
  it('can build params for create', function() {
    var builder = new Builder;

    builder
      .type('create')
      .host('http://example.com')
      .path('/projects')
      .attributes({ id: 1 })

    var expected = {
      json: { id: 1 },
      method: 'POST',
      url: 'http://example.com/projects',
    };

    builder.build().should.eql(expected);
  });

  it('can build params for update', function() {
    var builder = new Builder;

    builder
      .type('update')
      .host('http://example.com')
      .path('/projects')
      .attributes({ id: 1 })

    var expected = {
      json: { id: 1 },
      method: 'PUT',
      url: 'http://example.com/projects/1',
    };

    builder.build().should.eql(expected);
  });

  it('can build params for delete', function() {
    var builder = new Builder;

    builder
      .type('delete')
      .host('http://example.com')
      .path('/projects')
      .attributes({ id: 1 })

    var expected = {
      json: true,
      method: 'DELETE',
      url: 'http://example.com/projects/1',
    };

    builder.build().should.eql(expected);
  });

  it('can build params for find all', function() {
    var builder = new Builder;

    builder
      .type('all')
      .host('http://example.com')
      .path('/projects')

    var expected = {
      json: true,
      method: 'GET',
      url: 'http://example.com/projects',
    };

    builder.build().should.eql(expected);
  });

  it('can build params for find one', function() {
    var builder = new Builder;

    builder
      .type('one')
      .host('http://example.com')
      .attributes({ id: 1 })
      .path('/projects')

    var expected = {
      json: true,
      method: 'GET',
      url: 'http://example.com/projects/1',
    };

    builder.build().should.eql(expected);
  });

  it('can handle nested resources', function() {
    var builder = new Builder;

    builder
      .type('delete')
      .host('http://example.com')
      .path('/users/:user_id/projects')
      .attributes({ id: 1, user_id: 3 })

    var expected = {
      json: true,
      method: 'DELETE',
      url: 'http://example.com/users/3/projects/1',
    };

    builder.build().should.eql(expected);
  });

  it('can handle extensions', function() {
    var builder = new Builder;

    builder
      .type('delete')
      .host('http://example.com')
      .path('/projects')
      .ext('json')
      .attributes({ id: 1 })

    var expected = {
      json: true,
      method: 'DELETE',
      url: 'http://example.com/projects/1.json',
    };

    builder.build().should.eql(expected);
  });

  it('can handle query params', function() {
    var builder = new Builder;

    builder
      .type('delete')
      .host('http://example.com')
      .path('/projects')
      .attributes({ id: 1 })
      .query({ secret: true, auth: true })

    var expected = {
      json: true,
      method: 'DELETE',
      url: 'http://example.com/projects/1',
      qs: { secret: true, auth: true }
    };

    builder.build().should.eql(expected);
  });
});
