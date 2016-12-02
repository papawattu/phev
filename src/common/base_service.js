export default class BaseService {
	constructor({logger, messageBus} = {}) {
		this.logger = logger;
		this.messageBus = messageBus;
	}
}