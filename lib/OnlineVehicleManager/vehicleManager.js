'use strict';

const VM_PORT = 1974;
const API_PORT = 3001 ;

const VehicleCommandHandler = require('./vehicleCommandHandler');

module.exports = function VehicleMgr(logger) {
    const net = require('net');
    const hapi = require('hapi');
    const httpServer = new hapi.Server();
    const vehicleCommandHandler = new VehicleCommandHandler(logger);
    let server = null;

    function _registerPlugins() {
        httpServer.register({
            register: require('./VehicleManagerApi').VehicleManagerApiPlugin,
            options: {
                logger: logger,
            },
        }, (err) => {

            if (err) {
                throw err;
            }
        });
    }
    function _start(done) {
        server = net.createServer(function (socket) {
            socket.on('data', function (data) {
                logger.debug('Data ' + data);

                socket.write(vehicleCommandHandler.handleCommand(data.toString()));
            });
        });
        server.listen(process.env.VM_PORT || VM_PORT, '0.0.0.0',()=> {
            logger.info('Vehicle Manager listening on port ' + VM_PORT);
        });

        httpServer.connection({ port: process.env.VM_API_PORT || API_PORT });

        httpServer.start((err) => {

            if (err) {
                throw err;
            }
            logger.info('Vehicle Manager Http Api manager listening', httpServer.info.uri);
            _registerPlugins();
            done();
        });
    }

    function _stop(timeout,done) {

        server.close((err) => {
            if(err) {
                return done(err);
            }
            logger.info('Vehicle Manager all connections closed and shut down.');
        });

        httpServer.stop({ 'timeout': timeout}, (err) => {
            if(err) {
                return done(err);
            }
            logger.info('Vehicle Manager api connections closed and shut down.');
            done();
        });
    }

    return {
        stop : (timeout,done) => {
            _stop(timeout,done);
        },
        start : (done) => {
            _start(done);
        }
    };
};