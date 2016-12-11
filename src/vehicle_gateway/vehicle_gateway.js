import net from 'net';
import { Message, MessageTypes, MessageCommands } from '../common/message_bus/message_bus';
import { Topics } from '../common/message_bus/topics';
import HttpService from '../common/http_service';

const CRLF = '\r\n';

export default class VehicleGateway extends HttpService {
	constructor({ messageBus, name = 'VehicleGateway', port = 3081, gatewayPort = 1974}) {
		super({ messageBus, name, port });
		this.handlers = [];
		this.server = null;
		this.gatewayPort = gatewayPort;
		this.clients = [];
	}
	sendToSocket(string,socket) {
		socket.write(string + CRLF);
	}
	sendMessage(data,socket) {
		this.sendToSocket('OK',socket);
	}
	handleNewConnection(socket) {
		
		this.clients.push(socket);

		this.sendToSocket('HELLO PHEV',socket);

		socket.on('data', (data)=> {
			
			this.sendMessage(data,socket);
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

			this.server = net.createServer(this.handleNewConnection.bind(this));

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
