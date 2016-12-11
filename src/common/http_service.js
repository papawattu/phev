
import BaseService from './base_service';
import hapi from 'hapi';

export default class HttpService extends BaseService {
	constructor({ messageBus, port=3030, name = 'defaulthttpservicename', httpServer = new hapi.Server({})}) {
		super({ messageBus, name });
		this.port = port;
		this.httpServer = httpServer;
		this.httpServer.connection({
			port: this.port,
		});
	}
	start(done) {
		super.start(() => {
			this.httpServer.start((err) => {
				if (err) {
					this.logger.error(this.name + ' Service Http Api failed to start ' + err);
					throw err;
				}
				this.logger.info(this.name + ' Http Api listening', this.httpServer.info.uri);
				done();
			});
		});
	}
	stop(done) {
		super.stop(() => {
			this.httpServer.stop({}, (err) => {
				if (err) {
					this.logger.error(this.name + ' Http Api failed to stop ' + err);
					throw err;
				}
				done();
			});
		});
	}
	registerHttpHandler(name, endPoints) {
		this.logger.debug(`Registering plugin : ${name}`);
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