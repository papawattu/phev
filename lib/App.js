'use strict';

module.exports = function App() {

    const hapi = require('hapi');
    const server = new hapi.Server();

    server.connection({ port: process.env.SERVER_PORT || 3000 });

    server.register({
        register: require('./Operations/Lights').lights,
        options: {
         
        },
    }, (err) => {

        if (err) {
            throw err;
        }
    });
    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('PHEV Service running at:', server.info.uri);
    });
    return {
        stop : () => {
            server.stop({ timeout: 60 * 1000 }, (err) => {

                console.log('PHEV Server stopped');
            });
        }
    }
}