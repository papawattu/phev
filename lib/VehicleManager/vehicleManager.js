'use strict';

const VehicleCommandHandler = require('./vehicleCommandHandler');



module.exports = function VehicleMgr() {
    const net = require('net');
    const vehicleCommandHandler = new VehicleCommandHandler();
    const server = net.createServer(function(socket) {
	    socket.on('data',function(data) {
            console.log('Data ' + data);
            
            socket.write(vehicleCommandHandler.handleCommand(data.toString()));
        });
    });

    server.listen(1974, '');
};