const end = function (LiteCore) {
  function SocketLite (url, opts) {
    var pingTimeout // timeoutid
    var socketOpened = false // 标记连接是否打开
    var socketMsgQueue = [] // 消息队列
    var core =  new LiteCore(url, opts)
    var orrMsg = [] // 存储消息事件
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
    initEventHandle()

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
        reconnect({type: 'heart'})
      }, 30000)
    }
    /**
     * 重新连接
     */
    function reconnect (opts = {}) {
      console.log('网络中断重连接: type:' + opts.type)
      setTimeout(function () {
        core = new LiteCore(url, opts)
        initEventHandle()
      }, 2000)
      
    }
    const _this = this
    // 初始化事件函数
    function initEventHandle() {
      // 心跳检测
      core.onOpen(() => {
        socketOpened = true
        heartbeat(_this)
      })
      core.onClose(() => {
        socketOpened = false
        reconnect()
      })
      core.onError(() => {
        socketOpened = false
        reconnect()
      })
      core.onMessage(function (body) {
        let _body
        try {
          _body = JSON.parse(body)
        } catch (error) {
          _body = body
        }
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
    }
  }
  return SocketLite
}
module.exports = end
module.exports.default = end