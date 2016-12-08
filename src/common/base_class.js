import { logger } from './logger';

export default class BaseClass {
	constructor({logger, name = 'defaultbaseclassname'}) {
		console.log('logger ' + logger + ' param' + this.logger);
		this.logger = logger;
		this.name = name;
		this.logger.info('Logger is configured for : ' + this.name);
		console.log('logger ' + logger + ' param' + this.logger);

	}
}