/*!
 * snapshot - test/snapshot.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var request = require('supertest');
var should = require('should');
var snapshot = require('..');
var koa = require('koa');

var app = koa();
app.use(snapshot());

var status = 200;
var noSnapshot = false;
app.use(function* () {
  this.noSnapshot = noSnapshot;
  if (status === 200) {
    this.type = 'text/html; charset=gbk';
    return this.body = 'hello world';
  }
  if (status === 201) {
    this.status = 201;
    return this.body = {ok: true};
  }
  if (status === 302) {
    return this.redirect('https://github.com');
  }
  // 501 don't throw
  if (status === 501) {
    return this.status = 501;
  }
  this.throw(status);
});

app = app.callback();

describe('test/snapshot.test.js', function () {
  afterEach(function () {
    status = 200;
    noSnapshot = false;
  });

  it('should 500', function (done) {
    status = 500;
    request(app)
    .get('/')
    .expect(500, done);
  });

  describe('cache html', function () {
    before(function (done) {
      request(app)
      .get('/')
      .expect(200)
      .expect('hello world', done);
    });

    it('should return cached html when throw error', function (done) {
      noSnapshot = false;
      status = 500;
      request(app)
      .get('/')
      .expect(200)
      .expect('X-Snapshot-Status', 500)
      .expect('Content-Type', 'text/html; charset=gbk')
      .expect('hello world', done);
    });

    it('should return cached html when status > 500', function (done) {
      noSnapshot = false;
      status = 501;
      request(app)
      .get('/')
      .expect(200)
      .expect('X-Snapshot-Status', 501)
      .expect('Content-Type', 'text/html; charset=gbk')
      .expect('hello world', done);
    });

    it('should not cache when 302', function (done) {
      status = 302;
      request(app)
      .get('/')
      .expect(302, done);
    });

    it('should not cache when 404', function (done) {
      status = 404;
      request(app)
      .get('/')
      .expect(404, done);
    });

    it('should not cache when not html', function (done) {
      status = 201;
      request(app)
      .get('/')
      .expect({ok: true})
      .expect(201, done);
    });

    it('should not use cache when < 500', function (done) {
      status = 404;
      request(app)
      .get('/')
      .expect(404, done);
    });

    it('should not use cache when noSnapshot = true', function (done) {
      status = 500;
      noSnapshot = true;
      request(app)
      .get('/')
      .expect(500, done);
    });

    it('should not cache when noSnapshot = true', function (done) {
      noSnapshot = true;
      request(app)
      .get('/nocache')
      .expect(200, function (err) {
        should.not.exist(err);
        status = 500;
        noSnapshot = false;
        request(app)
        .get('/nocache')
        .expect(500, done);
      });
    });
  });
});
