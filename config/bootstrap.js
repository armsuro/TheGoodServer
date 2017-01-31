Promise = require("bluebird");
fs = require('fs');
crypto = require('crypto');
util = require('util');
flowrouteMessaging = require('../api/lib/flowroute-messaging-lib');
flowrouteNumbers = require('../api/lib/flowroute-numbers-lib');
nodemailer = require('nodemailer');
smtpTransport = require('nodemailer-smtp-transport');
moment = require("moment");
moment_zone = require('moment-timezone');
mailerModule = require('mailer');
request = require('request');
limiter = require("simple-rate-limiter");
csvjson = require('csvjson');
path = require('path');

REFERRAL_ROLE_ID = 4;
SURPER_ADMIN_ROLE_ID = 3;
CLIENT_ADMIN_ROLE_ID = 1;
DOMAIN_URL = "https://www.dataowl.io/#/"
MOUNTLY_CHARGE = 1;
CHARGE = 2;
MAX_MESSAGE_SIZE = 160;

module.exports.bootstrap = function(cb) {
    if (sails.config.environment === 'production' && !process.env.test_enabled) {
        console.log("Server running")
        DOMAIN_NAME = "https://api.dataowl.io";
        SHORT_URL = "lki.co";
        stripe = require("stripe")("sk_live_ROI3pEP0cBuVII0eo4W0FdYM");

        Migrations.seed();
    } else {
        DOMAIN_NAME = "http://localhost:1337";
        SHORT_URL = "localhost:1337";
        stripe = require("stripe")("sk_test_3myPQQCqEWvt8eyZ1FAbhJJw");
    }

    cb();
};