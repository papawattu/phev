import net from 'net';
import uuid from 'uuid';
import { MessageTypes, MessageCommands, Message } from '../common/message_bus/message_bus';
import { Topics } from '../common/message_bus/topics';
import HttpService from '../common/http_service';
import BaseClass from '../common/base_class';
import Store from '../common/store/new_store_sync';

const CRLF = '\r\n';

class VehicleSession {
	constructor() {
		//super({ name: 'VehicleSession' });
		this.id = uuid();
		this.dongleId = null;
		this.connected = false;
	}
}

export default class VehicleGateway extends HttpService {
	constructor({ messageBus, name = 'VehicleGateway', port = 3081, gatewayPort = 1974, store = new Store() }) {
		super({ messageBus, name, port });
		this.server = null;
		this.gatewayPort = gatewayPort;
		this.store = store;
		this.server = null;
		this.socketTable = [];
	}
	handle(cmd,cb) {
		this.messageBus.sendAndReceiveMessage({ topic: Topics.VEHICLE_HANDLER_TOPIC, payload: cmd, command: MessageCommands.NoOperation,producer: `handle ${cmd.command}`}, (msg) => {
			cb(msg);
		});
	}
	handleNewConnection(socket) {

		this.socketTable.push(socket);
		
		const session = new VehicleSession();

		socket.on('data', (data) => {
			const cmdLine = data.toString().split(/[, \t\r\n]+/);	
			this.handle({ id: session.id, command: cmdLine[0], args: cmdLine.slice(1) }, (msg) => {
				socket.write(msg.payload + CRLF);
			});
		});

		this.store.set(session.id, session);
		
		this.logger.debug('Vehicle gateway - created new session ' + session.id);
		socket.write('HELLO PHEV' + CRLF);
		
		return session;
	}
	getSession(id) {
		return this.store.get(id);
	}
	validateSession(data) {
		const session = this.store.get(data.sessionId);
		
		if(!session) {
			this.logger.error('Session cannot be validated as not found : ' + data.getSessionId);
			throw new Error('Session cannot be validated as not found : ' + data.getSessionId);
		}
		this.logger.debug('validateSession - Data : ' + JSON.stringify(data));
		
		session.connected = true;
		session.dongleId = data.dongleId;
		
		this.store.set(data.sessionId,session);
		this.logger.debug('validateSession - Stored Session : ' + JSON.stringify(session));
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
					async: false,
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
			this.socketTable = [];
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
