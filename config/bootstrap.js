Promise = require("bluebird");
fs = require('fs');
crypto = require('crypto');
util = require('util');
moment = require("moment");
request = require('request');
path = require('path');


module.exports.bootstrap = function(cb) {
    if (sails.config.environment === 'production' && !process.env.test_enabled) {
        console.log("Server running")
        DOMAIN_NAME = "";

        Migrations.seed();
    } else {
        DOMAIN_NAME = "http://localhost:1337";
    }

    cb();
};