'use strict';

const VMPORT = 1974;
const APIPORT = 3001 ;

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

    server.listen(VMPORT, '');
    logger.info("Vehicle Manager listening on port " + VMPORT);
    
    httpServer.connection({ port: process.env.VM_SERVER_PORT || APIPORT });

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