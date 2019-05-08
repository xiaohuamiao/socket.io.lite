# socket.io.lite
<!-- [![Build Status][travis-image]][travis-url] -->
[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> lightweight socket.io

## Installation

```bash
$ yarn add x-pages --dev

# or npm
$ npm install x-pages --dev
```

## Usage

> server

```js
const http = require('http')
const express = require('express')
const socketLite = require('../lib/server') // require('socket.io.lite')
const app = express()
...
const server = http.createServer(app)
const io = socketLite(server)
io.$on("connection", client => {
  console.log('connect')
  client.$on('testA', data => {
    console.log(data)
  })
  client.$emit('testB', { foo: 'bar' })
})
server.listen(3002)
```

> client

```js
// <script src="yourpath/lib/client.js"></script>
// or
// const io = require('yourpath/lib/client.js')
var socket = io('ws://127.0.0.1:3002')
socket.$on('connection', function () {
  console.log('connection')
})
socket.$emit('testA', { bar: 'foo' })
socket.$on('testB', function (data) {
  console.log()
})
```

## License

[MIT](LICENSE) &copy; [小花猫](https://xiaohuamiao.cn)

[downloads-image]: https://img.shields.io/npm/dm/socket.io.lite.svg
[downloads-url]: https://npmjs.org/package/socket.io.lite
[version-image]: https://img.shields.io/npm/v/socket.io.lite.svg
[version-url]: https://npmjs.org/package/socket.io.lite
[license-image]: https://img.shields.io/github/license/xiaohuamiao/socket.io.lite.svg
[license-url]: https://github.com/xiaohuamiao/socket.io.lite/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/xiaohuamiao/socket.io.lite.svg
[dependency-url]: https://david-dm.org/xiaohuamiao/socket.io.lite
[devdependency-image]: https://img.shields.io/david/dev/xiaohuamiao/socket.io.lite.svg
[devdependency-url]: https://david-dm.org/xiaohuamiao/socket.io.lite?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: http://standardjs.com