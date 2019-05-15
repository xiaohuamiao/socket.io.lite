# socket.io.lite
<!-- [![Build Status][travis-image]][travis-url] -->
[![NPM Downloads][downloads-image]][downloads-url]
[![CNPM Downloads][downloads-image-cnpm]][downloads-url-c]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]


> a lightweight socket.io library for websocket

> 支持微信小程序  
> contain heartbeat
> auto reconnect

## Tip
> 2.0 upgraded the api, using `new SocketLite ()` to create connections, no longer using `io()` to create connections.

## Installation

```bash
$ yarn add socket.io.lite

# or npm
$ npm install socket.io.lite
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
// events: open, close, error, ...
io.$on("open", client => {
  console.log('open')
  client.$on('testA', data => {
    console.log(data)
  })
  client.$emit('testB', { foo: 'bar' })
})
server.listen(3002)
```

> browser

```js
// <script src="yourpath/lib/client.js"></script> // window.SocketLite
// or
// const SocketLite = require('socket.io.lite/lib/browser.js')
var socket = new SocketLite('ws://127.0.0.1:3002')
socket.$on('open', function () {
  console.log('open')
})
socket.$emit('testA', { bar: 'foo' })
socket.$on('testB', function (data) {
  console.log()
})
```

> weapp (微信小程序)

```js
const SocketLite = require('socket.io.lite/lib/weapp.js')
var socket = new SocketLite('ws://127.0.0.1:3002')
socket.$on('open', function () {
  console.log('open')
})
socket.$emit('testA', { bar: 'foo' })
socket.$on('testB', function (data) {
  console.log()
})
```

## API

### client
```js
socket.$on(eventName, callback)
socket.$emit(eventName, data)  
```

### server
```js
io.$on(eventName, data)
io.$emit(eventName, callback) // braodcast
socket.$on(eventName, data)
socket.$emit(eventName, callback)
```

> about the $on  !!!  
Because `JSON.stringify` and `JSON.parse` are used in the current code, data is required to be an object and not to pass in a JSON format string.

## Todos
- [ ] 支持直接传递基本数据类型
- [ ] 支持传递二进制数据

## License

[MIT](LICENSE) &copy; [小花猫](https://xiaohuamiao.cn)

[downloads-image]: https://img.shields.io/npm/dm/socket.io.lite.svg
[downloads-image-cnpm]: https://xiaohuamiao.huamao110.now.sh/badge/d/socket.io.lite.svg
[downloads-url]: https://npmjs.org/package/socket.io.lite
[downloads-url-c]: https://npm.taobao.org/package/socket.io.lite
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
