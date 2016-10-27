'use strict';
const logger = require('./Common/logging');
const OpManager = require('./OperationsManager');
const VehicleMgr = require('./OnlineVehicleManager');

module.exports = function App() {

    const opmgr = new OpManager(logger);
    const vmgr = new VehicleMgr(logger);

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
    }
}