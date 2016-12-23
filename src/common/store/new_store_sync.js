
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
			if(keys.every(e => {
				return value[e] === filter[e];
			})) {
				result.set(key,value);
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