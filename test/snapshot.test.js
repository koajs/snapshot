/*!
 * snapshot - test/snapshot.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var snapshot = require('..');
var koa = require('koa');
var request = require('supertest');

var app = koa();
app.use(snapshot());

var status = 200;
app.use(function* () {
  if (status === 200) {
    this.type = 'html';
    return this.body = 'hello world';
  }

  this.throw(status);
});

app = app.callback();

describe('test/snapshot.test.js', function () {
  afterEach(function () {
    status = 200;
  });

  it('should not cache when 404', function (done) {
    status = 404;
    request(app)
    .get('/')
    .expect(404, done);
  });

  it('should 500', function (done) {
    status = 500;
    request(app)
    .get('/')
    .expect(500, done);
  });

  it('should 200 ok', function (done) {
    request(app)
    .get('/')
    .expect(200)
    .expect('hello world', done);
  });

  it('should cache 200 ok', function (done) {
    status = 500;
    request(app)
    .get('/')
    .expect(200)
    .expect('X-Snapshot-Status', 500)
    .expect('hello world', done);
  });

  it('should not use cache when < 500', function (done) {
    status = 404;
    request(app)
    .get('/')
    .expect(404, done);
  });
});
