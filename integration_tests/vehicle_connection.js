
import { logger } from '../lib/common/logger';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import net from 'net';
import App from '../lib/app';

const assert = chai.use(chaiAsPromised).assert;

let app = null;

const HOST = '127.0.0.1';
const PORT = '1974';
const EOL = '\r\n';

const eol = (str) => str + EOL;
const client = new net.Socket();
describe('Integration tests', () => {
		before(() => {
		app = new App();		
	});
	after((done) => {
		app.stop(done);
	});
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
			client.write(eol('CONNECT 12345'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('OK'), 'Return string should be OK is ' + data.toString());
					done();
				});
			});
		});
		it('Should connect and return NOT registeed, if dongle has not been registered', (done) => {
			client.write(eol('CONNECT 12345abc'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('NOT REGISTERED'), 'Return string should be NOT REGISTERED is ' + data.toString());
					done();
				});
			});
		});
	});
	describe.skip('Register device', () => {
		it('Should register vehicle when passed a device', (done) => {
			client.write(eol('REGISTER 123456'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('OK'), 'Return string should be OK is ' + data);
					done();
				});
			});
		});
		it('Should not allow device to be registered twice', (done) => {
			client.write(eol('REGISTER 123456'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('ERROR'), 'Return string should be ERROR is ' + data);
					done();
				});
			});
		});
	});
	describe.skip('Wifi details', () => {
		it('Should get SSID', (done) => {
			client.write(eol('SSID'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'SSID should be returned  : ' + data.toString());
					assert(data.toString() === eol('SSID123'), 'SSID should be SSID123 is ' + data.toString());
					done();
				});
			});
		});
		it('Should get password', (done) => {
			client.write(eol('PASSWORD'), () => {
				client.once('data', (data) => {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'PASSWORD should be returned  : ' + data.toString());
					assert(data.toString() === eol('PASSWORD123'), 'Password should be PASSWORD123 is ' + data.toString());
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