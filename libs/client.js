!(function () {
  var orr = [], pingTimeout, ws, url
  /**
   * 心跳检测
   */
  function heartbeat() {
    clearTimeout(this.pingTimeout)
    pingTimeout = setTimeout(function () {
      reConect()
    }, 30000 + 1000)
  }
  /**
   * 重连
   */
  function reConect () {
    ws = new WebSocket(url)
  }
  var io = function (uri) {
    var socket = {}
    url = uri
    ws = new WebSocket(uri)
    ws.onmessage = function (e) {
      var _body = JSON.parse(e.data)
      orr.forEach(item => {
        if (item.eventName !== _body.eventName) {
          return
        }
        item.callback(_body.data)
      })
    }
    socket.$on = function (eventName, callback) {
      if (eventName === 'open') {
        ws.onopen = function (e) {
          heartbeat()
          callback()
        }
        return
      }
      if (eventName === 'close') {
        clearTimeout(pingTimeout)
        ws.onopen = function () {
          callback()
        }
        return
      }
      if (eventName === 'error') {
        ws.onerror = function (err) {
          callback(err)
        }
        return
      }
      if (eventName === 'ping') {
        ws.onping = function () {
          heartbeat()
          callback()
        }
      }
      orr.push({eventName, callback})
    }
    socket.$emit = function (eventName, data) {
      ws.send(JSON.stringify({eventName, data}))
    }
    socket.ws = ws
    return socket
  }
  if ( typeof window === 'object') {
    window.io = io
  }
  if ( typeof module === 'object' && typeof module.exports === 'object' ) {
    module.exports = io
  }
})()