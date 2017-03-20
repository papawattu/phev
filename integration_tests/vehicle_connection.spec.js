
import { logger } from '../lib/common/logger';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import net from 'net';
import * as request from 'superagent';
import * as status from 'http-status';
import App from '../lib/app';

const PROTOCOL = 'http';
const HTTP_PORT = '3030';
const assert = chai.use(chaiAsPromised).assert;

let app = null;

const HOST = 'localhost';
const PORT = '1974';
const EOL = '\r\n';

const eol = (str) => str + EOL;
const client = new net.Socket();
describe('Vehicle Connection Integration tests', () => {
	before((done) => {

		//app = new App();

		const req = {
			register: {
				user: {
					firstName: 'Jamie',
					lastName: 'Nuttall',
					username: 'papawattu',
					password: 'Pa55word!',
					email: 'jamie@me.com',
				},
				vehicle: {
					ssid: 'REMOTE123456',
					password: 'qwertyuiop',
					vin: 'VIN1234',
				},
				dongle: {
					id: '00000000-addeadde-addeadde',
				}
			}
		};
		request.post(PROTOCOL + '://' + HOST + ':' + HTTP_PORT + '/registration')
            .send(req)
            .type('application/json')
            .accept('json')
            .end(function (err, res) {
	assert.ifError(err);
	assert.equal(res.headers.location, '/users/papawattu');
	assert.equal(res.status, status.CREATED);
	return done();
});
	});
//	after((done) => {
//		app.stop(done);
//	});
	describe('Connect vehicle', () => {
		it('Should connect and return HELLO PHEV', (done) => {
			client.connect(PORT, HOST, () => {
				logger.debug('Connected');
			});
			client.once('data', (data) => {
				assert(data.length > 0);
				assert(data.toString() === eol('HELLO PHEV'), 'Return string should be HELLO PHEV is' + data.toString());
				done();
			});
		});
		it('Should connect and return OK', (done) => {
			client.write(eol('CONNECT 00000000-addeadde-addeadde'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('OK'), 'Return string should be OK is ' + data.toString());
					done();
				});
			});
		});
		it('Should connect but return NOT REGISTERED', (done) => {
			client.write(eol('CONNECT notregistered'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('NOT REGISTERED'), 'Return string should be NOT REGISTERED is ' + data.toString());
					done();
				});
			});
		});
	});
	describe('Wifi details', () => {
		it('Should get SSID', (done) => {
			client.write(eol('SSID'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'SSID should be returned  : ' + data.toString());
					assert(data.toString() === eol('SSID REMOTE123456'), 'SSID should be REMOTE123456 is ' + data.toString());
					done();
				});
			});
		});
		it('Should get password', (done) => {
			client.write(eol('PASSWORD'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'PASSWORD should be returned  : ' + data.toString());
					assert(data.toString() === eol('PASSWORD qwertyuiop'), 'Password should be \'qwertyuiop\' is ' + data.toString());
					done();
				});
			});
		});
		it('Should handle wifi on', (done) => {
			client.write(eol('WIFION'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'OK should be returned  : ' + data.toString());
					assert(data.toString() === eol('OK'), 'OK should be returned is ' + data.toString());
					done();
				});
			});
		});
		it('Should handle host', (done) => {
			client.write(eol('HOST'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'Host and port should be returned  : ' + data.toString());
					assert(data.toString() === eol('HOST 192.168.6.46 8080'), 'HOST 192.168.6.46 8080 should be returned is ' + data.toString());
					done();
				});
			});
		});
		it('Should handle ready', (done) => {
			client.write(eol('READY'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'OK should be returned  : ' + data.toString());
					assert(data.toString() === eol('OK'), 'OK should be returned is ' + data.toString());
					done();
				});
			});
		});
	});
	describe('Close socket', () => {
		it('Should close socket', () => {
			client.destroy();
			assert.isTrue(client.destroyed, 'Socket closed error');
		});
	});
	describe('Stop server', () => {
		it('Should stop server', (done) => {
			app.stop(() => {
				done(); //TODO: add assert for server status
			});
		});
	});
});