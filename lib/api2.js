const end = function (LiteCore) {
  function SocketLite (url, opts) {
    const pingPongId = null// timeoutid
    const socketOpened = false // 标记连接是否打开
    const socketMsgQueue = [] // 消息队列
    // 其他消息事件
    const events = {
      open: [],
      error: [],
      close: []
    }
    let core =  new LiteCore(url, opts)
    core.events = events
    this.$on = (eventName, callback) => {
      // 以事件名为key存储到对象中
      if (typeof events[eventName] === 'object') {
        events[eventName].push(callback)
      } else {
        events[eventName] = [callback]
      }
    }
    this.$emit = (eventName, data) => {
      const res = {
        eventName,
        data
      }
      core.send(JSON.stringify(res))
    }
    this.$off = (eventName, callback) => {
      const eventsA = events[eventName]
      if (typeof eventsA !== 'object') {
        return false
      }
      events[eventName] = eventsA.filter(clb => clb !== callback)
    }
    this.initEvents = function () {
      // 清除之前初始化的事件
      // Object.keys(_events).forEach(key => {
      //   const arr = _events[key]
      //   arr.forEach(clb => {
      //     this.$off(key, clb)
      //   })
      // })
      this.$on('open', () => {
        this.heartCheck()
      })
      this.$on('pong', () => {
        clearTimeout(pingPongId)
        this.heartCheck()
      })
      this.heartCheck = () => {
        setTimeout(() => {
          this.$emit('ping', () => {
            pingPongId = setTimeout(() => {
              this.reconnect()
            }, 5000)
          })
        }, 10000)
      }
      this.$on('error', () => {
        this.reconnect()
      })
      this.$on('close', () => {
        this.reconnect()
      })
    }
    this.initEvents()
    const start = Date.now()
    this.reconnect = function () {
      setTimeout(() => {
        console.log((Date.now() - start )/ 1000)
        console.log('即将重新连接')
        core = new LiteCore(url, opts)
        core.events = events
      }, 2000)
    }
  }
  return SocketLite
}
module.exports = end
module.exports.default = end