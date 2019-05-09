module.exports = function (LiteCore) {
  function SocketLite (url, opts) {
    var pingTimeout // timeoutid
    var socketOpened = false // 标记连接是否打开
    var socketMsgQueue = [] // 消息队列
    var core =  new LiteCore(url, opts)
    var orrMsg = [] // 存储消息事件
    core.onMessage(function (body) {
      const _body = JSON.parse(body)
      for (let i = 0; i < orrMsg.length; i++) {
        const ele = orrMsg[i]
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
    this.$on = (eventName, callback) => {
      if (eventName === 'open') {
        core.onOpen(callback)
        return
      }
      if (eventName === 'error') {
        core.onError(callback)
        return
      }
      if (eventName === 'close') {
        core.onClose(callback)
        return
      }
      // 心跳检测
      if (eventName === 'ping') {
        heartbeat(this)
        return
      }
      orrMsg.push({eventName, callback})
    }
    this.$emit = function (eventName, data) {
      const body = {eventName}
      if ((typeof data) !== 'object') {
        body._singleData = data
      } else {
        body.data = data
      }
      const bodyStr = JSON.stringify(body)
      _sendMsg(bodyStr)
    }
    this.close = function () { core.close() }
    // 心跳检测
    core.onOpen(() => {
      socketOpened = true
      heartbeat(this)
    })
    core.onClose(() => {
      heartbeat(this)
    })
    core.onError(() => {
      heartbeat(this)
    })
  
    function _sendMsg (body) {
      if (socketOpened) {
        core.send(body)
      } else {
        socketMsgQueue.push(body)
      }
    }
    /**
     * 心跳检测，自动重联
     */
    function heartbeat(self) {
      self.$emit('ping', {})
      clearTimeout(pingTimeout)
      pingTimeout = setTimeout(() => {
        reconnect()
      }, 30000)
    }
    /**
     * 重新连接
     */
    function reconnect () {
      core = new LiteCore(url, opts)
    }
  }
  return SocketLite
}
