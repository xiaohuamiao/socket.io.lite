module.exports = function io (uri, opts = {}) {
  const socket = {}
  const orr = []
  const url = uri
  const socketMsgQueue = []
  let socketOpen = false
  const _opts = Object.assign({
    protocols: ['protocol1'],
    method: 'GET'
  }, opts)
  _opts.header = Object.assign({
    'content-type': 'application/json'
  }, opts.header || {})
  _opts.url = uri
  wx.connectSocket(_opts)
  wx.connectSocket({
    url: 'wss://example.qq.com',
    header: {
      'content-type': 'application/json'
    },
    protocols: ['protocol1'],
    method: 'GET'
  })
  /**
   * 在些之后才可以发送消息
   */
  wx.onSocketOpen(function (res) {
    socketOpen = true
    for (let i = 0; i < socketMsgQueue.length; i++) {
      sendSocketMessage(socketMsgQueue[i])
    }
    socketMsgQueue = []
  })
  /**
   * 发送队列中的消息
   */
  function sendSocketMessage (body) {
    if (socketOpen) {
      wx.sendSocketMessage({
        data: body
      })
    } else {
      socketMsgQueue.push(body)
    }
  }
  wx.onSocketMessage(function (body) {
    const _body = JSON.parse(body)
    for (let i = 0; i < orr.length; i++) {
      const ele = orr[i]
      if (ele.eventName !== _body.eventName) {
        continue
      }
      _body.callback(_body.data)
    }
  })
  // api
  /**
   * 接收消息
   */
  socket.$on = function (eventName, callback) {
    if (eventName === 'open') {
      wx.onSocketOpen(callback)
      return
    }
    if (eventName === 'close') {
      wx.onSocketClose(callback)
      return
    }
    if (eventName === 'error') {
      wx.onSocketError(callback)
      return
    }
    orr.push({ eventName, callback })
  }
  /**
   * 发送消息
   */
  socket.$emit = function (eventName, data) {
    const _body = JSON.stringify({eventName, data})
    sendSocketMessage(_body)
  }
  socket.close = SocketTask.close.bind(SocketTask)
  return socket
}