function LiteCoreWeapp (url, opts) {
  opts = opts || {}
  var _opts = JSON.parse(JSON.stringify(opts))
  _opts.url = url
  var socketTask = wx.connectSocket(_opts)
  this.onOpen = function (callback) {
    socketTask.onOpen(callback)
  }
  this.onError = function (callback) {
    socketTask.onError(callback)
  }
  this.onClose = function (callback) {
    socketTask.onClose(callback)
  }
  this.onMessage = function (callback) {
    socketTask.onMessage(function (res) {
      callback(res.data)
    })
  }
  this.send = function (body) {
    socketTask.send({data: body})
  }
  this.close = function () {
    socketTask.close()
  }
}

module.exports = LiteCoreWeapp
module.exports.default = LiteCoreWeapp
