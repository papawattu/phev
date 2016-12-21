import sinon from 'sinon';

export const Mocks = {};

Mocks.messageBus = {};
Mocks.messageBus.start = sinon.stub();
Mocks.messageBus.stop = sinon.stub();
Mocks.messageBus.sendMessage = sinon.stub();
Mocks.messageBus.subscribe = sinon.stub();
Mocks.messageBus.receiveMessageFilter = sinon.stub();

Mocks.operations = {};
Mocks.operations.start = sinon.stub().yields();
Mocks.operations.stop = sinon.stub().yields();

Mocks.vehicleRepository = {};
Mocks.vehicleRepository.start = sinon.stub().yields();
Mocks.vehicleRepository.stop = sinon.stub().yields();

Mocks.vehicleGateway = {};
Mocks.vehicleGateway.start = sinon.stub().yields();
Mocks.vehicleGateway.stop = sinon.stub().yields();

Mocks.vehicleHandler = {};
Mocks.vehicleHandler.start = sinon.stub().yields();
Mocks.vehicleHandler.stop = sinon.stub().yields();

Mocks.dongleRepository = {};
Mocks.dongleRepository.start = sinon.stub().yields();
Mocks.dongleRepository.stop = sinon.stub().yields();

Mocks.userRepository = {};
Mocks.userRepository.start = sinon.stub().yields();
Mocks.userRepository.stop = sinon.stub().yields();

Mocks.httpService = {};
Mocks.httpService.start = sinon.stub().yields();
Mocks.httpService.stop = sinon.stub().yields();

Mocks.store = {};
Mocks.store.get = sinon.stub();
Mocks.store.set = sinon.stub();
Mocks.store.del = sinon.stub();
Mocks.store.getAll = sinon.stub();
