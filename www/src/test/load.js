
// This module is quite special, as it is run in compile time.
// This module generates a JavaScript code to require other test modules.
//
// Just add `*_spec.js` to the `test` directory, and they will be required
// automatically!
//

var glob = require('glob')
var list = glob.sync('./**/*_spec.js', { cwd: __dirname })

module.exports = list.map(function(filename) {
  return 'require(' + JSON.stringify(filename) + ');\n'
}).join('')
