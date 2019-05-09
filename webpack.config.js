const path = require('path');
module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: './lib/browser.js',
  // entry: [
  //   './lib/weapp.js',
  //   './lib/browser.js',
  //   './lib/nodejs.js'
  // ],
  output: {
    filename: 'browser.js',
    path: path.resolve(__dirname, 'dist')
  }
}