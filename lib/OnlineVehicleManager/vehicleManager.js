'use strict';

const VM_PORT = 1974;
const API_PORT = 3001 ;

const VehicleCommandHandler = require('./vehicleCommandHandler');

module.exports = function VehicleMgr(logger) {
    const net = require('net');
    const hapi = require('hapi');
    const httpServer = new hapi.Server();

    const vehicleCommandHandler = new VehicleCommandHandler(logger);
    const server = net.createServer(function(socket) {
	    socket.on('data',function(data) {
            logger.debug('Data ' + data);
    
            socket.write(vehicleCommandHandler.handleCommand(data.toString()));
        });
    });

    server.listen(process.env.VM_PORT || VM_PORT, 'localhost');
    logger.info('Vehicle Manager listening on port ' + VM_PORT);
    
    httpServer.connection({ port: process.env.VM_API_PORT || API_PORT });

    httpServer.register({
        register: require('./VehicleManagerApi').VehicleManagerApiPlugin,
        options: {
            logger : logger,
        },
    }, (err) => {

        if (err) {
            throw err;
        }
    });
    httpServer.start((err) => {

        if (err) {
            throw err;
        }
        logger.info('Http Api manager listening', httpServer.info.uri);
    });
};