"use strict";

var mongo = require('mongodb').MongoClient;

var registrationStore = {
    set : function (user) {

    },
    get : function (user) {
        return false;
    }
};

module.exports = registrationStore;