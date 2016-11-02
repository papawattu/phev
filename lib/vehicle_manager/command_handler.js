'use strict';

module.exports = function VehicleCommandHandler(logger) {

    const CRLF = '\r\n';
    
    function _response (res) {
        return res + CRLF;
    }
    return {
        handleCommand: (commandLine) => {
            logger.debug(commandLine);

            const cmd = commandLine.split(/[, \t\r\n]+/);
            logger.debug('Command is ' + cmd[0] + ' ' + cmd.length + ' parameters');

            switch (cmd[0]) {
                case 'CONNECT' :
                {
                    logger.debug('Connect called');
                    return _response('OK');
                }
                case 'VERSION' :
                {
                    logger.debug('Version called');
                    return _response('OK');
                }
                case 'UPDATE' :
                {
                    logger.debug('Update called');
                    return _response('NO');
                }
                case 'REGISTER' :
                {
                    logger.debug('Register function called');
                    return _response('OK');
                }
                case 'SECRET' :
                {
                    logger.debug('Secret function called');
                    return _response('0123456789ABCDEF');
                }
                case 'PING' :
                {
                    logger.debug('Ping function called');
                    return _response('OK');
                }
                default :
                {
                    return _response('INVALID');
                }
            }
        }
    }

}
