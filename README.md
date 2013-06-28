mongoose-random
===============

Get a random document from a collection.

## Installation

```
npm install mongoose-random
```

## Usage

```js
var mongoose = require('mongoose');
var random = require('mongoose-random');

var Schema = new mongoose.Schema({ /* ... */ });
Schema.plugin(random);

var Song = mongoose.model('Song', Schema);

// get a random song
Song.findRandom(function (err, song) {
  console.log(song);
})
```

You can change the path of the field that stores the random data by passing options to the plugin:

```
Schema.plugin(random, { path: '_r' });
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
