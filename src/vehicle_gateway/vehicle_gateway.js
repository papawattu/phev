import net from 'net';
import uuid from 'uuid';
import { MessageTypes, MessageCommands } from '../common/message_bus/message_bus';
import { Topics } from '../common/message_bus/topics';
import HttpService from '../common/http_service';
import BaseClass from '../common/base_class';
import Store from '../common/store/new_store_sync';

const CRLF = '\r\n';

class VehicleSession extends BaseClass {
	constructor({ socket }) {
		super({name: 'VehicleSession'});
		this.id = uuid();
		this.socket = socket;
	}
	send(message) {
		this.socket.write(message + CRLF);
	}
}

export default class VehicleGateway extends HttpService {
	constructor({ messageBus, name = 'VehicleGateway', port = 3081, gatewayPort = 1974,store = new Store()}) {
		super({ messageBus, name, port });
		this.handlers = [];
		this.server = null;
		this.gatewayPort = gatewayPort;
		this.clients = [];
		this.store = store;
		this.server = net.createServer(this.handleNewConnection.bind(this));
	}
	sendResponse(data,socket) {
		this.sendToSocket('OK',socket);
	}
	handleNewConnection(socket) {

		const vehicleSession = new VehicleSession(socket);

		this.store.set(vehicleSession.id,vehicleSession);

		vehicleSession.send('HELLO PHEV')

		socket.on('data', (data)=> {


			this.sendResponse(data,socket);
		});
	}
	start(done) {
		super.start(() => {
			this.registerMessageHandler(Topics.GATEWAY_TOPIC, null, { type: MessageTypes.Request },
				[{
					name: MessageCommands.Get,
					numArgs: 1,
					handle: null,
				}, {
					name: MessageCommands.Add,
					numArgs: 1,
					handle: null,
				}]);

			this.server.on('error', (err) => {
				throw err;
			});

			this.server.listen(this.gatewayPort, '0.0.0.0', (err) => {
				if (err) {
					throw err;
				} else {
					this.logger.info('Vehicle Manager listening on port ' + this.gatewayPort);
					done();
				}
			});
		});

	}
	stop(done) {
		this.server.close((err) => {
			super.stop(() => {
				done(err);
			});
		});
	}
}
