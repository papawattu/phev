import { MessageTypes, MessageCommands, Message } from '../common/message_bus/message_bus';
import { Topics } from '../common/message_bus/topics';
import BaseService from '../common/base_service';

export default class VehicleHandler extends BaseService {
    constructor({ messageBus, name = 'VehicleHandler' }) {
        super({ messageBus, name });

    }
    start(done) {
        super.start(() => {
            this.registerMessageHandler(Topics.GATEWAY_TOPIC, null, { type: MessageTypes.Request },
                [{
                    name: MessageCommands.NoOperation,
                    numArgs: 1,
                    handle: this.handle,
                }]);
            done();
        });
    }
    /*stop(done) {
        super.stop(done);
    }*/
    handle(data) {
        return 'OK';
    }
}