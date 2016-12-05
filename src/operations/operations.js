import BaseService from '../common/base_service';
import Registration from './registration';

export default class Operations extends BaseService {
	constructor({logger, messageBus}) {
		super({ logger, messageBus });
		this.name = 'Operations';
		this.registration = new Registration({logger,messageBus});
	}
	start(done) {
		super.start(() => {
			this.registration.start(() => {
				done();
			});
		});
	}
	stop(done) {
		super.stop(() => {
			this.registration.stop(() => {
				done();
			});
		});
	}
}
