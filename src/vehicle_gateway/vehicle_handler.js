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
	handle(commandLine,cb) {
		this._findCommand(commandLine.command).handle.call(this,commandLine,cb);
	}
	connect(cmd,cb) {
		this.messageBus.sendAndReceiveMessage({topic: Topics.DONGLE_TOPIC, payload: cmd.args[0], command: MessageCommands.Get},(data) => {
			if (data.payload !== undefined) {
				this.messageBus.sendAndReceiveMessage({topic: Topics.GATEWAY_TOPIC, payload: cmd.id, command: MessageCommands.Add},(reply) => {		
					cb('OK');
				});
			} else {
				cb('NOT REGISTERED');
			}
		});
	}
	ssid(id,cb) {
		const dongleMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: id[1], correlation: true });

		this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: dongleMessage.correlationId, type: MessageTypes.Response }, (dongle) => {
			const vehicleMessage = new Message({ topic: Topics.VEHICLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: dongle.vin, correlation: true });
		
			this.messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { correlationId: vehicleMessage.correlationId, type: MessageTypes.Response }, (vehicle) => {
		
			if (vehicle.payload !== undefined) {
				cb(vehicle.ssid);
			} else {
				cb('NO SSID');
			}
			});
			this.messageBus.sendMessage(vehicleMessage);
		});
		this.messageBus.sendMessage(dongleMessage);
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