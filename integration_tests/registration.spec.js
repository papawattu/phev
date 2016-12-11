
const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3030';

import * as request from 'superagent';
import * as status from 'http-status';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import App from '../lib/app';

const assert = chai.use(chaiAsPromised).assert;

let app = null;


describe('Integration Tests', () => {
	before(() => {
		app = new App();		
	});
	after((done) => {
		app.stop(done);
	});
	describe('Registration operations', () => {
		it('Should register', (done) => {
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
						id: '12345',
					}
				}
			};
			request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/registration')
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
		it('Should not register twice', (done) => {
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
						id: '12345',
					}
				}
			};
			request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/registration')
				.send(req)
				.type('application/json')
				.accept('json')
				.end(function (err, res) {
					assert.equal(res.status, status.BAD_REQUEST);
					return done();
				});
		});
	});
});