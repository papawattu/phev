import BaseService from './base_service';
import hapi from 'hapi';

export default class HttpService extends BaseService {
	constructor({logger, messageBus}) {
		super({ logger, messageBus });
	}
	start() {
		super.start();
		this.httpServer = new hapi.Server({
			debug: {
				request: ['error'],
				log: ['error']
			}
		});
		this.httpServer.connection({
			port: process.env.SERVER_PORT || 3030,
		});
		this.httpServer.start((err) => {
			if (err) {
				throw err;
			}
			this.logger.info('User Service Http Api listening', this.httpServer.info.uri);
		});
	}
	stop() {
		super.stop();
		this.httpServer.stop({}, (err) => {
			if (err) throw err;
		});

	}
	registerHttpHandler(name, endPoints) {

		const plugin = {
			register: (server, options, next) => {
				server.route([{
					method: 'GET',
					path: endPoints.get.path,
					handler: endPoints.get.method,
				}, {
					method: 'POST',
					path: endPoints.post.path,
					handler: endPoints.post.method,
				}]);
				next();
			}
		};
		plugin.register.attributes = {
			name: name,
		//	version: '1.0.0'
		};

		this.httpServer.register(plugin, (err) => {
			if (err) {
				this.logger.error('HttpService : Error registering plugin ' + err);
				throw err;
			}
		});
	}
}