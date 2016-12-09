import HttpService from '../common/http_service';

export default class VehicleGateway extends HttpService {
    constructor({ messgageBus,name = 'VehicleGateway',port}) {
        super({ messgageBus,name,port});
    }
}
