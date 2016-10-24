'use strict';

const hapi = require('hapi');
const httpServer = new hapi.Server();

module.exports = function HttpApiServer(logger) {
    httpServer.connection({ port: process.env.SERVER_PORT || 3000 });

    httpServer.register({
        register: require('./Operations/Lights').lights,
        options: {
            logger: logger,
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
}