const url = require('url')
const WebSocket = require('ws')
function liteServer (server = {}, opts = {}) {
  let port, wss, io = {}
  let shareServer = false
  let _opts = JSON.parse(JSON.stringify(opts))
  if (isNaN(server)) {
    if (!server || server && !server.listen) {
      throw new Error('should a http server object')
    }
    shareServer = true
  } else {
    port = parseInt(server)
  }
  // 与http(s)共享端口
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
    // 不与http(s)共享端口
    wss = ws.Server({port})
  }
  io.clients = new Map()
  io.$on = function (eventName, callback) {
    if (eventName === 'open') {
      wss.on('connection', function connection (client) {
        var pongTimeout
        let libClient = {
          _orr: [] // 存储事件
        }
        io.clients.set(libClient, client)
        client.on('message', function incoming (body) {
          const _body = JSON.parse(body)
          libClient._orr.forEach(item => {
            if (item.eventName === _body.eventName) {
              item.callback(_body.data)
              return
            }
          })
        })
        libClient.$on = function on (eventName, callbackSon) {
          if (eventName === 'close') {
            client.on('close', function disconnect () { callbackSon() })
            return
          }
          if (eventName === 'error') {
            client.on('error', function error (err) { callbackSon(err) })
          }
          libClient._orr.push({eventName, callback: callbackSon})
        }
        libClient.$emit = function emit (eventName, data) {
          if (client.readyState !== WebSocket.OPEN) {
            return
          }
          const _body = { eventName, data }
          client.send(JSON.stringify(_body))
        }
        /**
         * 心跳检测
         */
        libClient.$on('pong', function heartbeat (data) {
          clearTimeout(pongTimeout)
          setTimeout(() => {
            io.clients.delete(libClient)
            libClient = null
            client.terminate()
          }, 30000 + 1000)
        })
        callback(libClient)
      })
      return
    }
  }
  // 广播(给所有人)
  io.$emit = function (eventName, newData, callback) {
    const body = {
      eventName,
      data: newData
    }
    io.clients.forEach((client, libClient) => {
      if (client.readyState !== WebSocket.OPEN) {
        return
      }
      if (typeof callback === 'function') {
        if (!callback(client)) {
          return
        }
      }
      client.send(JSON.stringify(body))
    })
  }
  io.wss = wss
  return io
}
module.exports = liteServer
