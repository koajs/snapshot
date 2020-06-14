'use strict';

const DefaultCache = require('lru-cache');
const defaultOptions = {
  max: 50 * 1024 * 1024, // 50mb
  maxAge: 12 * 60 * 60 * 1000, // 12h
  length(n) {
    return n.body ? n.body.length : 0;
  }
};

module.exports = function (options) {
  options = options ? { ...options, ...defaultOptions } : defaultOptions;
  const cache = options.cache || new DefaultCache(options);

  // eslint-disable-next-line func-names
  return async function snapshot(ctx, next) {
    try {
      await next();
    } catch (err) {
      return errorHandler(err, ctx);
    }

    getFromCache(ctx);
    setCache(ctx);
  };

  function setCache(ctx) {
    if (ctx.noSnapshot) return;
    // only cache html
    if (!ctx.response.is('html')) return;
    // only cache 2xx
    if (((ctx.status / 100) | 0) !== 2) return;
    // update cache
    cache.set(ctx.path, {
      body: ctx.body,
      type: ctx.response.get('Content-Type') || 'html'
    });
  }

  function getFromCache(ctx) {
    if (ctx.noSnapshot) return;
    if (ctx.status < 500) return;
    const c = cache.get(ctx.path);
    if (!c) return;

    ctx.type = c.type;
    ctx.body = c.body;
    ctx.set('X-Snapshot-Status', ctx.status || 500);
    ctx.status = 200;
  }

  function errorHandler(err, ctx) {
    if (ctx.noSnapshot) throw err;
    if (err.status && err.status < 500) throw err;
    const c = cache.get(ctx.path);
    if (!c) throw err;

    ctx.app.emit('error', err);
    ctx.type = c.type;
    ctx.body = c.body;
    ctx.set('X-Snapshot-Status', err.status || 500);
  }
};
