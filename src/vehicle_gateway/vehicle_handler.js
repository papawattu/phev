import { MessageTypes, MessageCommands, Message } from '../common/message_bus/message_bus';
import { Topics } from '../common/message_bus/topics';
import BaseService from '../common/base_service';



export default class VehicleHandler extends BaseService {
	constructor({ messageBus, name = 'VehicleHandler' }) {
		super({ messageBus, name });
		this.commands = [{
			name: 'CONNECT',
			numArgs: 0,
			handle: this.connect
		}, {
			name: 'VERSION',
			numArgs: 1,
			handle: this.version
		}, {
			name: 'SSID',
			numArgs: 0,
			handle: this.ssid
		}, {
			name: 'PASSWORD',
			numArgs: 0,
			handle: this.password
		}];

	}
	_splitCommand(cmd) {
		return cmd.split(/[, \t\r\n]+/);
	}
	_findCommand(cmd) {
		return this.commands.find(e => e.name === cmd);
	}
	_isValidCommand(cmd) {
		return (this._findCommand(cmd) != undefined);
	}
	start(done) {
		super.start(() => {
			this.registerMessageHandler(Topics.VEHICLE_HANDLER_TOPIC, null, { type: MessageTypes.Request },
				[{
					name: MessageCommands.NoOperation,
					numArgs: 1,
					handle: this.handle.bind(this),
					async: true,
				}]);
			done();
		});
	}
    /*stop(done) {
        super.stop(done);
    }*/
	handle(commandLine, cb) {
		this._findCommand(commandLine.command).handle.call(this, commandLine, cb);
	}
	registerConnection(dongle, cb) {
		this.messageBus.sendAndReceiveMessage({ topic: Topics.GATEWAY_TOPIC, payload: dongle, command: MessageCommands.Add }, (reply) => {
			if (reply.error === undefined) {
				cb('OK');
			} else {
				cb(reply.error);
			}
		});
	}
	connect(cmd, cb) {
		this.logger.debug('Connect dongle ' + cmd.args[0]);
		this.getDongle(cmd.args[0], (data) => {
			if (data !== undefined) {
				this.logger.debug('Connect dongle found ' + data.id);
				this.registerConnection({ sessionId: cmd.id, dongleId: data.id }, cb);
			} else {
				this.logger.debug('Connect dongle not found ');
				cb('NOT REGISTERED');
			}
		});
	}
	getDongle(dongleId, cb) {
		this.messageBus.sendAndReceiveMessage({ topic: Topics.DONGLE_TOPIC, payload: dongleId, command: MessageCommands.Get }, (data) => {
			cb(data.payload);
		});
	}
	getSession(sessionId, cb) {
		this.messageBus.sendAndReceiveMessage({ topic: Topics.GATEWAY_TOPIC, payload: sessionId, command: MessageCommands.Get }, (reply) => {
			if (reply.error === undefined) {
				cb(reply.payload);
			} else {
				cb(reply.error);
			}
		});
	}
	getVehicle(vin, cb) {
		this.messageBus.sendAndReceiveMessage({ topic: Topics.VEHICLE_TOPIC, payload: vin, command: MessageCommands.Get }, (data) => {
			cb(data.payload);
		});
	}
	getVehicleFromDongleId(dongleId, cb) {
		this.getDongle(dongleId, (dongle) => {
			if (dongle !== undefined) {
				this.logger.debug('EYE CATCHER - Found dongle ' + dongle);
				this.getVehicle(dongle.vin, (vehicle) => cb(vehicle));
			} else {
				this.logger.debug('EYE CATCHER - Could not find dongle Id ' + dongleId);
				cb(undefined);
			}
		});
	}
	ssid(cmd, cb) {
		this.getSession(cmd.id, (session) => {
			if (session) {
				if (session.connected) {
					this.getVehicleFromDongleId(session.dongleId, (vehicle) => {
						if (vehicle !== undefined) {
							cb('SSID ' + vehicle.ssid);
						} else {
							cb('ERROR');
						}
					});
				} else {
					cb('ERROR');
				}
			} else {
				this.logger.error('Vehicle Handler SSID : Cannot find session for id ' + cmd.id);
				cb('ERROR');
			}
		});

	}
	password(id) {
		const dongleMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: id, correlation: true });

		this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: dongleMessage.correlationId, type: MessageTypes.Response }, (data) => {
			const vehicleMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: data.vin, correlation: true });

			this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: vehicleMessage.correlationId, type: MessageTypes.Response }, (data) => {
				return data.password;
			});
			this.messageBus.sendMessage(vehicleMessage);
		});
		this.messageBus.sendMessage(dongleMessage);
	}
}