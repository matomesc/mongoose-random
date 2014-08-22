mongoose-random ![buildstatus](https://travis-ci.org/matomesc/node-battle.svg?branch=master)
===============

Fetch random document(s) from your mongoose collections.

## Installation

```
npm install mongoose-random
```

## Usage

```js
var mongoose = require('mongoose');
var random = require('mongoose-random');

var Schema = new mongoose.Schema({ /* ... */ });
Schema.plugin(random, { path: 'r' }); // by default `path` is `random`. It's used internally to store a random value on each doc.

var Song = mongoose.model('Song', Schema);

// get 10 random songs
Song.findRandom().limit(10).exec(function (err, songs) {
  console.log(songs);
});

// `findRandom` has the same signature as mongoose's `Model.find`:
var filter = { playlist: { $in: ['hip-hop', 'rap'] } };
var fields = { name: 1, description: 0 };
var options = { skip: 10, limit: 10 }
Song.findRandom(filter, fields, options, function (err, songs) {
  console.log(songs);
});

// if you have an existing collection, it must first by synced.
// this will add random data for the `path` key for each doc.
Song.syncRandom(function (err, result) {
  console.log(result.updated);
});
```

## License

The MIT License (MIT)

Copyright (c) 2013 Mihai Tomescu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
