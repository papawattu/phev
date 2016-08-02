var PROTOCOL    = process.env.PROTOCOL || 'http',
    HOST        = process.env.HOST || 'localhost',
    PORT        = process.env.PORT ||  8081,
    API         = process.env.api || 'api',
    HOST_API    = PROTOCOL + '://' + HOST + ':' + PORT + '/' + API;

exports.HOST        = HOST;
exports.PORT        = PORT;
exports.API         = API;
exports.PROTOCOL    = PROTOCOL;
exports.HOST_API    = HOST_API;
