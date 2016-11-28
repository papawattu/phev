'use strict';

var logger = require('./logging');
var EOL = '\r\n';

exports.eol = function (str) {
  return (str || '') + EOL;
};
exports.logger = logger;