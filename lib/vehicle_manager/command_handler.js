'use strict';

module.exports = function VehicleCommandHandler(logger) {

    return {
        handleCommand : (commandLine) => {
            logger.debug(commandLine);
            
            const cmd = commandLine.split(' ');
            logger.debug('Command is ' + cmd[0] + ' ' + cmd.length + ' parameters');
            
            switch(cmd[0]) {
                case 'CONNECT' : {
                    logger.debug('Connect called');
                    return 'OK' 
                }
                case 'VERSION' : {
                    logger.debug('Version called');
                    return 'OK' 
                }
                case 'UPDATE' : {
                    logger.debug('Update called');
                    return 'NO' 
                }
                case 'REGISTER' : {
                    logger.debug('Register function called');
                    return 'OK';
                } 
                case 'SECRET' : {
                    logger.debug('Secret function called');
                    return '0123456789ABCDEF';
                }
                case 'PING' : {
                    logger.debug('Ping function called');
                    return 'OK';
                }
                default : {
                    return 'INVALID';
                }
            }
        }
    }
}
