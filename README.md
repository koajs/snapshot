snapshot
----------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/koa-snapshot.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-snapshot
[travis-image]: https://img.shields.io/travis/koajs/snapshot.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/snapshot
[coveralls-image]: https://img.shields.io/coveralls/koajs/snapshot.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/snapshot?branch=master
[david-image]: https://img.shields.io/david/koajs/snapshot.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/snapshot
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.11-red.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/koa-snapshot.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-snapshot
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/

take snapshot when request, cache by request path.

## Install

```
npm install koa-snapshot
```

## Usage

```
var koa = require('koa');
var snapshot = require('koa-snapshot');
var app = koa();

app.use(snapshot());

```

## Options

Use your own cache client by `options.cache`.
If do not present `options.cache`, snapshot will create a [lru-cache](https://github.com/isaacs/node-lru-cache) instance with the options.

default options for lru-cache:

```
{
  max: 50 * 1024 * 1024,  // 50mb
  maxAge: 12 * 60 * 60 * 1000,  // 12h
  length: function (n) {
    return n.length;
  }
}
```

## Turn off Snapshot

You can manually turn off snapshot by set `this.noSnapshot = true` in every request.

## License

MIT
