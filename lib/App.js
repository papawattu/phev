'use strict';

module.exports = function App() {

    const hapi = require('hapi');
    const httpServer = new hapi.Server();

    httpServer.connection({ port: process.env.SERVER_PORT || 3000 });

    httpServer.register({
        register: require('./Operations/Lights').lights,
        options: {
         
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
        console.log('PHEV Service running at:', httpServer.info.uri);
    });

    const VehicleApi = require('./VehicleApi');

    const v = new VehicleApi();
    
    
    return {
        stop : () => {
            httpServer.stop({ timeout: 60 * 1000 }, (err) => {

                console.log('PHEV Server stopped');
            });
            ipServer.stop();
        }
    }
}