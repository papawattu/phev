'use strict';

const PORT = 1974;
const VehicleCommandHandler = require('./vehicleCommandHandler');



module.exports = function VehicleMgr(logger) {
    const net = require('net');
    const vehicleCommandHandler = new VehicleCommandHandler(logger);
    const server = net.createServer(function(socket) {
	    socket.on('data',function(data) {
            logger.debug('Data ' + data);
    
            socket.write(vehicleCommandHandler.handleCommand(data.toString()));
        });
    });

    server.listen(PORT, '');
    logger.info("Vehicle Manager listening on port " + PORT);
};