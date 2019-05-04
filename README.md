## What is `metator`?

Getting information about video files from a torrent and local files.

## Installation

```bash
npm i metator
```

## Usage

Import the library in your code:

```js
const metator = require('metator');
```

### This is video/torrent?

- From video

```js
metator.isvi('./bunny.m4v').then(res => {
    console.log(res); //=> true
});
```

- From torrent

```js
metator.isto('3652DB1AFBC5D414DBCAF5920F741FF93B1ED9E5').then(res => {
    console.log(res); //=> true
});
```

- From video/torrent

```js
metator.isvt('6B!@#$%^5B').then(res => {
    console.log(res); //=> false
});
```

### Get info from video/torrent

- From video

```js
metator.info('./bunny.m4v').then(res => {
    console.log(res); 
    // [ { type: 'video',
    //     path: './bunny.m4v',
    //     size: 3889885,
    //     name: 'bunny.m4v',
    //     sha1: '2951247a448b6123494a039623bde6b9f79603ed' } ]
});
```

- From torrent

```js
metator.info('https://archive.org/download/Colgate-Comedy-Hour-S6E1/Colgate-Comedy-Hour-S6E1_archive.torrent').then(res => {
    console.log(res);
    //[ { type: 'torrent',
    //    size: 1444438016,
    //    name: 'ColgateComedyHourS6E1.mpg',
    //    hash: '4df210f9e64d63193e41bcfbb7e3b5c540a1e874',
    //    season: '6',
    //    episode: '1' },
    //  { type: 'torrent',
    //    size: 277512087,
    //    name: 'ColgateComedyHourS6E1.ogv',
    //    hash: '4df210f9e64d63193e41bcfbb7e3b5c540a1e874',
    //    season: '6',
    //    episode: '1' },
    //  { type: 'torrent',
    //    size: 257035508,
    //    name: 'ColgateComedyHourS6E1_512kb.mp4',
    //    hash: '4df210f9e64d63193e41bcfbb7e3b5c540a1e874',
    //    season: '6',
    //    episode: '1' } ]
});
```

- From video/torrent

```js
metator.info('6B!@#$%^5B').then(res => {
    console.log(res); //=> []
});
```

## Running tests

```bash
npm test
```