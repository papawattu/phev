"use strict";

const assert = require('chai').assert;
const chai = require('chai');
const Cache = require('cache-base');

const Store = require('./store');

let store;

before(function (done) {
    store = new Store(new Cache());
    let test = {test : 'bob'};
    store.set('key',test).then(() => {
        done();
    });
});
describe('Store get and set', () => {

    it('should get value', (done) => {
        let test = {};
        store.get('key').then((data) => {
            test.test = 'bob';
            assert.deepEqual(data,test);
            done();
        });
    }); 

    it('should set value', () => {
        let test2 = {},
            data;
        
        test2.test = 'bob2';
        store.set('key2',test2)
            .then((data) => {
                store.get('key2').then((data) => {
                assert.deepEqual(data,test2);
            });
        });
    }); 
});
describe('Store has', () => {
    it('should have value', () => {
        store.has('key').then((data) => {
            assert.isTrue(data);
            it('should return undefined for key not found', () => {
                store.get('key3').then((data) => {
                    assert.isUndefined(data);
                });
            });
        });
    });
});
describe('Store del', (done) => {
    store = new Store(new Cache());
    let test = {test : 'bob'};
    store.set('key',test).then(() => {
        done();
    });
    it('should delete value', (done) => {
        store.del('key').then(() => {
            store.get('key').then((data) => {
                assert.isUndefined(data);
                done();
            });
        });
    }); 
    it('should return undefined for key not found', (done) => {
        let value = store.get('key3').then((data) => {
            assert.isUndefined(data);
            done();
        });
    });
});

//todo these tests pass but make no sense yet

describe.skip('Store keys', (done) => {
    it('should return all keys', () => {
        store.set('test','bob').then((data) => {
            assert.isArray(store.keys());
            done();
        });
    });
    it('should add key', (done) => {
        store.set('newkey','bob').then(() => {
            assert.isArray(store.keys());
            assert.include(store.keys(),'newkey');
            done();
        });
    });
    it('should delete key', (done) => {
        store.del('newkey').then(() => {
            assert.isArray(store.keys());
            //assert.notInclude(store.keys(),'newkey',10);
            done();
        });
    });
});     