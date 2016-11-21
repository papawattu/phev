'use strict';
const logger = require('./common/logging');
const OpManager = require('./operations_manager');
const VehicleMgr = require('./vehicle_manager');

module.exports = function App() {

	const opmgr = new OpManager();
	const vmgr = new VehicleMgr();

	opmgr.start(() => {
		logger.info('Started Operations Manager service.');
	});
	vmgr.start(() => {
		logger.info('Started Vehicle Manager service.');
	});

	return {
		stop : (timeout,done) => {
			logger.info('Stopping services');
			opmgr.stop({ timeout : timeout }, (err) => {
				if(err) {
					logger.error('Operations Manager Server failed to stop ' + err);
					done(err);
				}
				logger.info('Operations Manager Server stopped');
			});
			vmgr.stop({ timeout: timeout},(err) => {
				if(err) {
					logger.error('Vehicle Manager Server failed to stop ' + err);
					done(err);
				}
				logger.info('Vehicle Manager Server stopped');
				done();
			});
		},
		status : () => {
			return [];
		}
	};
};