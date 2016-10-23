'use strict';
const logger = require('./common/logging');

module.exports = function App() {
    
    const HttpApiManager = require('./HttpApiManager');

    const VehicleMgr = require('./VehicleManager');

    const hmgr = new HttpApiManager(logger);
    
    const vmgr = new VehicleMgr(logger);
    
    return {
        stop : () => {
            httpServer.stop({ timeout: 60 * 1000 }, (err) => {
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