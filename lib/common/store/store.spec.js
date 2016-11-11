"use strict";

const assert = require('chai').assert;
const chai = require('chai');
const Store = require('./store');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const store  = new Store();

before(function () {

});
describe('Store get and set', () => {

    it('should set and get value', () => {
        let test2 = {};
        test2.test = 'bob2';
        return store.set('key2', test2).then(() => {
            return store.get('key2').then((data) => {
                return assert.deepEqual(data, test2);
            });
        });
    });
});
describe('Store has', () => {
    it('should has key', () => {
        return store.set('key' , 'value').then(() => {
            return store.has('key').then((data) => {
                return assert.isTrue(data);
            });
        })
    });
    it('should return undefined for key not found', () => {
        return store.get('key3').then((data) => {
            return assert.isUndefined(data);
        });
    });
});
describe('Store del', () => {
    var test;
    before(()=> {
        test = {test : 'bob'};
        store.set('key',test)
    })

    it('should delete value', () => {
        return store.del('key').then(() => {
            return store.get('key').then((data) => {
                return assert.isUndefined(data);
            });
        });
    }); 
    it('should return undefined for key not found', () => {
        let value = store.get('key3').then((data) => {
            return assert.isUndefined(data);
        });
    });
});