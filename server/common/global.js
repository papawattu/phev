var PROTOCOL    = 'http',
    HOST        = 'localhost',
    PORT        =  '8080',
    API         = 'api';
    
exports.HOST = process.env.HOST || HOST;
exports.PORT = process.env.PORT || PORT;
exports.API = process.env.API || API;
exports.PROTOCOL = process.env.PROTOCOL || PROTOCOL;
exports.HOST_API = PROTOCOL + '://' + HOST + ':' + PORT + '/' + API;

