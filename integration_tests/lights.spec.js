
const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3031';

import * as request from 'superagent';
import * as status from 'http-status';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import App from '../lib/app';

const assert = chai.use(chaiAsPromised).assert;

let app = null;


describe('Light Operations Integration Tests', () => {
	before(() => {
		app = new App();
	});
	//after((done) => {
	//	app.stop(done);
	//});
	describe('Head Lights operations', () => {
		it('Should switch on lights', (done) => {
			const op = {
				status: 'on',
			};
			request.put(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/lights/head')
				.send(op)
				.type('application/json')
				.accept('json')
                .set('username','papawattu')
				.end(function (err, res) {
					assert.ifError(err);
					assert.equal(res.headers.location, '/users/papawattu');
					assert.equal(res.status, status.CREATED);
					return done();
				});
		});
	});
});