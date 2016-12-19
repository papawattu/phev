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
        return this.commands.find(e => e.name === this._splitCommand(cmd)[0]);
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
        console.log('args ' + this._splitCommand(commandLine)[1]);
        
        this._findCommand(commandLine).handle.call(this,this._splitCommand(commandLine),cb);
    }
    connect(id,cb) {
        const dongleMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: id[1], correlation: true });
        console.log('ID ' + id);
        this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: dongleMessage.correlationId, type: MessageTypes.Response }, (data) => {
            console.log('DATA is ' + data.payload);
            if (data.payload !== undefined) {
                cb('OK');
            } else {
                cb('NOT REGISTERED');
            }
        });
        this.messageBus.sendMessage(dongleMessage);
    }
    ssid(id) {
        const dongleMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: id, correlation: true });

        this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: dongleMessage.correlationId, type: MessageTypes.Response }, (data) => {
            const vehicleMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: data.vin, correlation: true });

            this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: vehicleMessage.correlationId, type: MessageTypes.Response }, (data) => {
                return data.ssid;
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