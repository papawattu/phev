import sinon from 'sinon';

export const Mocks = {};

Mocks.messageBus = {};
Mocks.messageBus.start = sinon.stub();
Mocks.messageBus.stop = sinon.stub();
Mocks.messageBus.sendMessage = sinon.stub();
Mocks.messageBus.subscribe = sinon.stub();

Mocks.operations = {};
Mocks.operations.start = sinon.stub();
Mocks.operations.stop = sinon.stub();

Mocks.vehicleRepository = {};
Mocks.vehicleRepository.start = sinon.stub();
Mocks.vehicleRepository.stop = sinon.stub();

Mocks.dongleRepository = {};
Mocks.dongleRepository.start = sinon.stub();
Mocks.dongleRepository.stop = sinon.stub();

Mocks.userRepository = {};
Mocks.userRepository.start = sinon.stub();
Mocks.userRepository.stop = sinon.stub();