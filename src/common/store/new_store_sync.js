
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
	getWithFilter(filter) {
		const keys = Object.keys(filter);
		const result = new Map();
		for(let [key, value] of this.elements.entries()) {
			console.log('key ' + key + ' value ' + JSON.stringify(value) + ' filter ' + JSON.stringify(filter));
			if(keys.every(e => {
				console.log('value[e] ' + value[e] + ' filter[e] ' + filter[e] + ' e ' + e);
				return value[e] === filter[e];
			})) {
				result.set(key,value);
				console.log('result ' + JSON.stringify(result));
			}
		}
		return Array.from(result);
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