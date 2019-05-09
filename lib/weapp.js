module.exports = function io (uri, opts = {}) {
  let socketTask = null
  const socket = {}
  const orr = []
  const url = uri
  let socketMsgQueue = []
  let socketOpen = false
  const _opts = Object.assign({
    protocols: ['protocol1'],
    method: 'GET'
  }, opts)
  _opts.header = Object.assign({
    'content-type': 'application/json'
  }, opts.header || {})
  _opts.url = uri
  socketTask = wx.connectSocket(_opts)
  /**
   * 在些之后才可以发送消息
   */
  socketTask.onOpen(function (res) {
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
      socketTask.send({
        data: body
      })
    } else {
      socketMsgQueue.push(body)
    }
  }
  socketTask.onMessage(function (body) {
    const _body = JSON.parse(body.data)
    for (let i = 0; i < orr.length; i++) {
      const ele = orr[i]
      if (ele.eventName !== _body.eventName) {
        continue
      }
      let data = _body.data
      if (_body.hasOwnProperty('_singleData')) {
        data = _body.data._singleData
      }
      ele.callback(data)
    }
  })
  // api
  /**
   * 接收消息
   */
  socket.$on = function (eventName, callback) {
    if (eventName === 'open') {
      socketTask.onOpen(callback)
      return
    }
    if (eventName === 'close') {
      socketTask.onClose(callback)
      return
    }
    if (eventName === 'error') {
      socketTask.onError(callback)
      return
    }
    orr.push({ eventName, callback })
  }
  /**
   * 发送消息
   */
  socket.$emit = function (eventName, data) {
    const body = {eventName}
    if ((typeof data) !== 'object') {
      body._singleData = data
    }
    const bodyStr = JSON.stringify(body)
    sendSocketMessage(bodyStr)
  }
  socket.close = socketTask.close.bind(socketTask)
  return socket
}