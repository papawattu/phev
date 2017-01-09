var SIM900 = require('SIM900');
var Adapter = require('adapter');

Serial1.setup(115200,{path: '/dev/ttyAMA0'});

var adapter = Adapter({sim900: SIM900,
                           serial: Serial1, 
                           apn: 'everywhere',
                           username: 'eesecure',
                           password: 'secure'});