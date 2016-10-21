'use strict';

module.exports = function VehicleCommandHandler() {

    return {
        handleCommand : (commandLine) => {
            console.log(commandLine);
            
            const cmd = commandLine.split(' ');
            console.log(cmd);
            switch(cmd[0]) {
                case 'REGISTER' : {
                    return 'OK';
                } 
                case 'SECRET' : {
                    return '0123456789ABCDEF';
                }
            }
        }
    }
}
