'use strict';

module.exports = function statusController(status,logger) {

	logger.debug('Creating status controller');

	function _getStatus(request,reply) {
		logger.debug('Reguest get status.');

		return reply({status : 'RUNNING'}).code(200);
	}
	return {
		getStatus : _getStatus
	};
};