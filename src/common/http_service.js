import BaseService from './base_service';
import hapi from 'hapi';

export default class HttpService extends BaseService {
	constructor({logger, messageBus, port=3030, name}) {
		super({ logger, messageBus });
		this.port = port;
		this.name = name;
	}
	start() {
		super.start();
		this.httpServer = new hapi.Server({

		});
		this.httpServer.connection({
			port: this.port,
		});
		this.httpServer.start((err) => {
			if (err) {
				this.logger.error(this.name + ' Service Http Api failed to start ' + err);
				throw err;
			}
			this.logger.info(this.name + ' Http Api listening', this.httpServer.info.uri);
		});
	}
	stop() {
		super.stop();
		this.httpServer.stop({}, (err) => {
			if (err) {
				this.logger.error(this.name + ' Http Api failed to stop ' + err);
				throw err;
			}
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