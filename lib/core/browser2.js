function LiteCoreBrowser (url, opts) {
  const socket = new WebSocket(url)
  socket.onopen =  () => {
    console.log('lib:建立连接')
    this.events['open'].forEach(callback => callback())
  }
  socket.onerror = () => {
    console.log('lib:连接出错')
    this.events['error'].forEach(callback => callback())
  }
  socket.onclose = () => {
    console.log('lib:关闭链接')
    this.events['close'].forEach(callback => callback())
  }
  socket.onmessage = (e) => {
    const res = JSON.parse(e.data)
    const callbacks = this.events[res.eventName]
    if (!callbacks) {
      return
    }
    callbacks.forEach(callback => callback(res.data))
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
