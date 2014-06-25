/*!
 * snapshot - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var LRUCache = require('lru-cache');
var copy = require('copy-to');

var defaultOptions = {
  max: 50 * 1024 * 1024,  // 50mb
  maxAge: 12 * 60 * 60 * 1000,  // 12h
  length: function (n) {
    return n.length;
  }
};

module.exports = function (options) {
  options = options || {};
  copy(defaultOptions).to(options);

  var cache = exports.contentCache = new LRUCache(options);

  return function* snapshot(next) {
    try {
      yield *next;
    } catch (err) {
      return errorHandler(err, this);
    }

    // only cache html
    if (!this.response.is('html')) return;
    // update cache
    cache.set(this.path, this.body);

    function errorHandler(err, ctx) {
      if (err.status && err.status < 500) throw err;

      var content = cache.get(ctx.path);
      if (content) {
        ctx.app.emit('error', err);
        ctx.type = 'html';
        ctx.body = content;
        return;
      }

      throw err;
    }
  };
};
