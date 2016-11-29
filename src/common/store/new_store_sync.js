'use strict';

class Store {
	constructor() {
		this.elements = [];
	}
	getAll() {
		return this.elements.map(e => e.value);
	}
	get(key) {
		return this.elements.find(e => e.key === key);
	}
	set(key,value) {
		this.elements.push({key : key, value : value});
	}
	has(key) {
		return (this.get(key) != undefined);
	}
}

export {Store};