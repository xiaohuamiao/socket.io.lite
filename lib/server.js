const url = require('url')
const WebSocket = require('ws')
// 存储 pathname 及相应的 wss 对象
const oPath = {}
function liteServer (server = {}, opts = {}) {
  let port, wss, io = {}, orr = [], shareServer = false
  let _opts = JSON.parse(JSON.stringify(opts))
  if (isNaN(server)) {
    // 不是数字
    if (!server || server && !server.listen) {
      throw new Error('should a http server object')
    }
    shareServer = true
  } else {
    port = parseInt(server)
  }
  if (shareServer) {
    wss = new WebSocket.Server({noServer: true})
    server.on('upgrade', function upgrade(request, socket, head) {
      const pathname = url.parse(request.url).pathname
      // 第一个版本不区分 url
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request)
      })
    })
  } else {
    wss = ws.Server({port})
  }
  // 添加属性
  io.$on = function (eventName, callback) {
    if (eventName === 'open') {
      wss.on('connection', function connection (client) {
        client.isAlive = true;
        client.on('pong', function heartbeat () {
          this.isAlive = true
        })
        client.on('message', function incoming (body) {
          const _body = JSON.parse(body)
          orr.forEach(item => {
            if (item.eventName === _body.eventName) {
              item.callback(_body.data)
              return
            }
          })
        })
        client.$on = function on (eventName, callbackSon) {
          orr.push({eventName, callback: callbackSon})
        }
        client.$emit = function emit (eventName, data) {
          const _body = { eventName, data }
          client.send(JSON.stringify(_body))
        }
        callback(client)
      })
      return
    }
    if (eventName === 'close') {
      wss.on('close', function disconnect () { callback() })
      return
    }
    if (eventName === 'error') {
      wss.on('error', function error (err) { callback(err) })
    }
  }
  // 广播(给所有人)
  io.$emit = function (eventName, newData) {
    const body = {
      eventName,
      data: newData
    }
    wss.clients.forEach(function each (client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(body))
      }
    })
  }
  // io.broadcast = {
  //   emit: function emit (eventName, newData) {
  //     wss.clients.forEach(function each(client) {
  //       if (client.readyState === WebSocket.OPEN) {
  //         client.send(JSON.stringify(body))
  //       }
  //     })
  //   }
  // }

    // 心跳检测
    function noop() {}
    const interval = setInterval(function ping () {
      wss.clients.forEach(function each (ws) {
        if (ws.isAlive === false) return ws.terminate()
        ws.isAlive = false;
        ws.ping(noop)
      })
    }, 30000)
    io.wss = wss
  return io
}
module.exports = liteServer