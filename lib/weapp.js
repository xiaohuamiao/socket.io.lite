const CoreLite = require('./core/webapp')
const api = require('./api')
module.exports = api(CoreLite)
module.exports.default = api(CoreLite)
