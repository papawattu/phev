import { logger } from '../common/logger';

export default class BaseClass {
	constructor({name = 'defaultbaseclassname'}) {
		this.logger = logger;
		this.name = name;
		this.logger.info('Logger is configured for : ' + this.name);
	}
}