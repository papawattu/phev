'use strict';
const logger = require('./Common/logging');

module.exports = function App() {
    
    const OpManager = require('./OperationsManager');
    const VehicleMgr = require('./OnlineVehicleManager');

    const opmgr = new OpManager(logger);
    const vmgr = new VehicleMgr(logger);
    
    return {
        stop : () => {
            opmgr.stop({ timeout: 60 * 1000 }, (err) => {
                if(_err) {
                    logger.error('PHEV Server failed to stop ' + err);
                    return;
                }
                logger.info('PHEV Server stopped');
            });
            vmgr.stop({ timeout: 60 * 1000},(err) => {
                if(_err) {
                    logger.error('Vehicle Manager Server failed to stop ' + err);
                    return;
                }
                logger.info('Vehicle Manager Server stopped');
            });
        }
    }
}