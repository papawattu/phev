'use strict';
const logger = require('./logging');
const findRemoveSync = require('find-remove');
const EOL = '\r\n';

findRemoveSync('/logs', {extensions: ['.bak', '.log']});

exports.eol = (str) => (str || '') + EOL;
exports.logger = logger;