var net = require('net');

var EOL = '\r\n';
var counter = 0;
var connected = 0;

export default class Adapter {
    constructor({serial, sim900, apn, username, password}) {
        this.serial = serial;
        this.sim900 = sim900;
        this.apn = apn;
        this.ip = null;
        this.username = username;
        this.password = password;
        this.gprs = this.sim900.connect(this.serial, undefined, (err) => {
            if (err) throw err;
            this.gprs.connect(this.apn, this.username, this.password, (err) => {
                if (err) throw err;
                this.gprs.getIP((err, ip) => {
                    this.ip = ip;
                    if (err) throw err;
                    net.connect({ host: this.host, port: this.port }, (res) => {
                        res.on('data', (data) => {
                            console.log('Data => ' + data);
                        });
                    });
                });
            });
        });
    }
}
