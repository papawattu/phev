'use strict';
const logger = require('./logging');
const EOL = '\r\n';

exports.eol = (str) => (str || '') + EOL;
exports.logger = logger;