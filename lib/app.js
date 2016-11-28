'use strict';

var logger = require('./common/logging');
var OpManager = require('./operations_manager');
var VehicleMgr = require('./vehicle_manager');

module.exports = function App() {

	var opmgr = new OpManager();
	var vmgr = new VehicleMgr();

	opmgr.start(function () {
		logger.info('Started Operations Manager service.');
	});
	vmgr.start(function () {
		logger.info('Started Vehicle Manager service.');
	});

	return {
		stop: function stop(timeout, done) {
			logger.info('Stopping services');
			opmgr.stop({ timeout: timeout }, function (err) {
				if (err) {
					logger.error('Operations Manager Server failed to stop ' + err);
					done(err);
				}
				logger.info('Operations Manager Server stopped');
			});
			vmgr.stop({ timeout: timeout }, function (err) {
				if (err) {
					logger.error('Vehicle Manager Server failed to stop ' + err);
					done(err);
				}
				logger.info('Vehicle Manager Server stopped');
				done();
			});
		},
		status: function status() {
			return [];
		}
	};
};