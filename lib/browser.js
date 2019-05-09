const CoreLite = require('./core/browser')
const api = require('./api')
window.SocketLite = api(CoreLite)
