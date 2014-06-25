snapshot
----------

[![Build Status](https://secure.travis-ci.org/koajs/snapshot.svg)](http://travis-ci.org/koajs/snapshot)
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

all the options are pass to [lru-cache](https://github.com/isaacs/node-lru-cache).

default options:

```
{
  max: 50 * 1024 * 1024,  // 50mb
  maxAge: 12 * 60 * 60 * 1000,  // 12h
  length: function (n) {
    return n.length;
  }
}
```

## License

MIT
