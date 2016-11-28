'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var status = require('http-status');
var httpMocks = require('node-mocks-http');

chai.use(chaiAsPromised);

var UserManagerApiController = require('./controller');
var sut = new UserManagerApiController();

describe('User manager controller', function () {
	it('Should register vehicle', function () {
		//let req = Sinon.stub(request, 'get');


		//let res = httpMocks.createResponse();
		//sut.registerUser(req,res);
		//assert.becomes(res.status,'201');

	});
});