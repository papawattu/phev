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

Mocks.vehicleManager = {};
Mocks.vehicleManager.start = sinon.stub();
Mocks.vehicleManager.stop = sinon.stub();