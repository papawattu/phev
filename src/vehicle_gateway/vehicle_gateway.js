import net from 'net';
import uuid from 'uuid';
import { MessageTypes, MessageCommands, Message } from '../common/message_bus/message_bus';
import { Topics } from '../common/message_bus/topics';
import HttpService from '../common/http_service';
import BaseClass from '../common/base_class';
import Store from '../common/store/new_store_sync';

const CRLF = '\r\n';

class VehicleSession extends BaseClass {
	constructor({socket ,handle}) {
		super({ name: 'VehicleSession' });
		this.id = uuid();
		this.socket = socket;
		this.socket.on('data', (data) => {
			handle(data, (msg) => {
				this.send(msg.payload);
			});
		});
	}
	send(message) {
		this.socket.write(message + CRLF);
	}
}

export default class VehicleGateway extends HttpService {
	constructor({ messageBus, name = 'VehicleGateway', port = 3081, gatewayPort = 1974, store = new Store() }) {
		super({ messageBus, name, port });
		this.server = null;
		this.gatewayPort = gatewayPort;
		this.store = store;
		this.server = null;
	}
	handle(data,cb) {
		const message = new Message({ topic: Topics.GATEWAY_TOPIC, type: MessageTypes.Request, command: MessageCommands.NoOperation, payload: data, correlation: true });

		this.messageBus.receiveMessageFilter(Topics.GATEWAY_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (msg) => {
			cb(msg);
		});
		this.messageBus.sendMessage(message);

	}
	handleNewConnection(socket) {

		const vehicleSession = new VehicleSession({ socket, handle: this.handle.bind(this) });

		this.store.set(socket.id, vehicleSession);
		vehicleSession.send('HELLO PHEV');
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

			if(this.server === null) {
				this.server = net.createServer(this.handleNewConnection.bind(this));
			}
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
