'use strict';
require('./logging');
const EOL = '\r\n';

exports.eol = (str) => (str || '') + EOL;