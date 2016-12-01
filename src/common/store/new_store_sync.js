'use strict';

export default class Store {
	constructor() {
		this.elements = new Map();
	}
	getAll() {
		return this.elements.entries();
	}
	get(key) {
		return this.elements.get(key);
	}
	set(key,value) {
		return this.elements.set(key,value);
	}
	has(key) {
		return this.elements.has(key);
	}
	del(key) {
		return this.elements.delete(key);
	}
}