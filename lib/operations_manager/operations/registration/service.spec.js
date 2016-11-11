'use strict';

const logger = require('../../../common/logging');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../../common/store');
const assert = chai.assert;
const expect = chai.expect;
const RegistrationService = require('./service');

const store = new Store();
const sut = new RegistrationService(store, logger);

chai.use(chaiAsPromised);
const User = function(_firstName,_lastName,_userName,_password,_email,_phevSsid,_phevPassword,_vin) {
    let firstName = _firstName;
    let lastName = _lastName;
    let userName = _userName;
    let password = _password;
    let email = _email;
    let phevSsid = _phevSsid;
    let phevPassword = _phevPassword;
    let vin = _vin;
    this.toString = function () {
        return firstName + ' ' + lastName;
    }

};

const user = new User('name','last','papawattu','email','1234','1234','1234');

describe('Registration service', () => {

    before(() => {

    })
    it('Should register user', () => {
        console.log(user.toString());
        return sut.createUser(user).then(() => {
            return store.get('papawattu').then((data) => {
                return assert.equal(data,user);
            });
        });
    });
    it('Should not allow same username to be registered twice', () => {
        return assert.isRejected(sut.createUser(user));
    });
});