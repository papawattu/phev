import HttpService from '../common/http_service';

export default class VehicleGateway extends HttpService {
    constructor({logger,messgageBus,name = 'VehicleGateway',port}) {
        super(logger,messgageBus,name,port);
    }
}
