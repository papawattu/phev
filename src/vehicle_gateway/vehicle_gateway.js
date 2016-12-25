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
		this.dongleId = null;
		this.socket = socket;
		this.connected = false;
		this.socket.on('data', (data) => {
			const cmdLine = data.toString().split(/[, \t\r\n]+/);	
			handle({ id: this.id, command: cmdLine[0], args: cmdLine.slice(1) }, (msg) => {
				this.send(msg.payload);
			});
		});
	}
	send(message) {
		this.socket.write(message + CRLF);
	}
	toString() {
		return JSON.stringify(this,['id','dongleId','connected']);
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
	handle(cmd,cb) {
		this.messageBus.sendAndReceiveMessage({ topic: Topics.VEHICLE_HANDLER_TOPIC, payload: cmd, command: MessageCommands.NoOperation }, (msg) => {
			cb(msg);
		});
	}
	handleNewConnection(socket) {

		const session = new VehicleSession({ socket, handle: this.handle.bind(this) });

		this.store.set(session.id, {id: session.id,connected: false,dongleId: null});
		session.send('HELLO PHEV');
		
		return session;
	}
	getSession(id) {
		return this.store.get(id);
	}
	validateSession(data) {
		const session = this.store.get(data.sessionId);
		
		this.logger.debug('Data : ' + JSON.stringify(data));
		this.logger.debug('Session : ' + JSON.stringify(session));
		
		session.connected = true;
		session.dongleId = data.dongleId;
		this.store.set(data.sessionId,session);
		this.logger.debug(JSON.stringify(session));
		
		return session;
	}
	start(done) {
		super.start(() => {
			this.registerMessageHandler(Topics.GATEWAY_TOPIC, null, { type: MessageTypes.Request },
				[{
					name: MessageCommands.Get,
					numArgs: 1,
					handle: this.getSession,
					async: false,
				}, {
					name: MessageCommands.Add,
					numArgs: 1,
					handle: this.validateSession,
					async: true,
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
