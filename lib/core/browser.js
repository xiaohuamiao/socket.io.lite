function LiteCoreBrowser (url, opts) {
  var openHandlers = []
  var closeHandlers = []
  var errorHandlers = []
  var messageHandlers = []
  var socket = new WebSocket(url)
  this.onOpen = function (callback) {
    var handlers = openHandlers
    handlers.push(callback)
    socket.onopen = function () {
      for (var i = 0; i < handlers.length; i++) {
        var ele = handlers[i]
        ele()
      }
    }
  }
  this.onError = function (callback) {
    var handlers = errorHandlers
    handlers.push(callback)
    socket.onerror = function () {
      for (var i = 0; i < handlers.length; i++) {
        var ele = handlers[i]
        ele()
      }
    }
  }
  this.onClose = function (callback) {
    var handlers = closeHandlers
    handlers.push(callback)
    socket.onerror = function () {
      for (var i = 0; i < handlers.length; i++) {
        var ele = handlers[i]
        ele()
      }
    }
  }
  this.onMessage = function (callback) {
    var handlers = messageHandlers
    handlers.push(function (res) {
      callback(res.data)
    })
    socket.onerror = function () {
      for (var i = 0; i < handlers.length; i++) {
        var ele = handlers[i]
        ele()
      }
    }
  }
  this.send = function (body) {
    socket.send(body)
  }
  this.close = function () {
    socket.close()
  }
}
module.exports = LiteCoreBrowser
module.exports.default = LiteCoreBrowser
