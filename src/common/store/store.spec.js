'use strict';

import chai from 'chai';
import Store from './new_store_sync';
import chaiAsPromised from 'chai-as-promised';

const assert = chai.use(chaiAsPromised).assert;

const store  = new Store();

const TestObj = {
	init: function(value) {
		this.value = value;
		return this;
	},
};

const testObj2 = {
	key1 : 'key1',
	key2 : 'key2',
};
const testObj3 = {
	key1 : 'key3',
	key2 : 'key2',
};
before(() => {

});
describe('Store set', () => {
	it('should set value', () => {
		const test = Object.create(TestObj).init('Jamie');
		store.set('key',test);
		assert.deepEqual(store.get('key'),test);
	});
	it('should set value twice', () => {
		const test = Object.create(TestObj).init('Chris');
		store.set('key',test);
		assert.deepEqual(store.get('key'),test);
	});
});
describe('Store get', () => {
	it('should get value', () => {
		const test = Object.create(TestObj).init('Chris');
		assert.deepEqual(store.get('key'), test);
	});
	it('should get undefined back when key not found', () => {
		assert.equal(store.get('key2'), undefined);
	});
});
describe('Store getAll', () => {
	it('should get all values', () => {
		let store = new Store();
		store.set('getall',testObj2);
		assert.deepEqual(...store.getAll(),['getall',testObj2]);
	});
	it('should get undefined back when key not found', () => {
		assert.equal(store.get('key2'), undefined);
	});
});
describe('Store getFilter', () => {
	it('should filter values', () => {
		const store = new Store();
		store.set('filtertest1',testObj2);
		store.set('filtertest2',testObj2);
		assert.deepEqual(store.getWithFilter({key1: 'key1'}),[["filtertest1",{"key1":"key1","key2":"key2"}],["filtertest2",{"key1":"key1","key2":"key2"}]]);

	});
	it('should get empty array back when filtered value not found', () => {
		const store = new Store();

		store.set('filtertest1',testObj3);
		assert.deepEqual(store.getWithFilter({key1: 'key1'}),[]);
	});
});
describe('Store has', () => {
	it('should have key', () => {
		assert.equal(store.has('key'),true);
	});
	it('should return undefined for key not found', () => {
		assert.equal(store.has('key3'),false);
	});
});
describe('Store delete', () => {

	it('should delete value', () => {
		store.del('key');
		assert.equal(store.has('key'),false);
	});
	it('should be able to delete value twice', () => {
		store.del('key');
		assert.equal(store.has('key'),false);
	});
});
