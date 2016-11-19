'use strict';

const EOL = '\r\n';

module.exports = function Util() {
	return {
		logger: require('./logging'),
		eol: str => (str || '') + EOL
	};
};