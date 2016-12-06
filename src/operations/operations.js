import BaseService from '../common/base_service';
import Registration from './registration';

export default class Operations extends BaseService {
	constructor({logger, messageBus,
		operations = [
			new Registration({ logger, messageBus })
		]}) {

		super({ logger, messageBus, name: 'Operations' });

		this.operations = operations;
	}
	start(done) {
		super.start(() => {
			this.operations.forEach((operation) => {
				operation.start((err) => {
					if (err) {
						this.logger.error(operation.name + ' failed to start ' + err);
					 	throw err;
					}
				});
			});
		});
		done();
	}
	stop(done) {
		super.stop(() => {
			this.registration.stop(() => {
			});
		});
		done();
	}
}
