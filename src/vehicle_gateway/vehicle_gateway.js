import HttpService from '../common/http_service';

export default class VehicleGateway extends HttpService {
    constructor({logger,messgageBus,name,port}) {
        super(logger,messgageBus,name,port);
    }
}
