/**
 * FlowrouteMessagingLib
 *
 * This file was automatically generated for flowroute by APIMATIC BETA v2.0 on 02/11/2016
 */

var requestClient = require('../Http/Client/RequestClient'),
    configuration = require('../configuration'),
    APIHelper = require('../APIHelper');

var MessagesController = {

    /**
     * Send a message
     * @param {Message} message    Required parameter: Message Object to send.
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    createMessage: function(message, vip, callback, data) {
        message.to = message.to.length == 10 ? "1" + message.to : message.to;
        //prepare query string for API call;
        var baseUri = vip ? "https://api.flowroute.com/vip/v2" : configuration.BASEURI;

        var queryBuilder = baseUri + "/messages";

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);

        //prepare headers
        var headers = {
            "content-type": "application/json; charset=utf-8"
        };

        //Remove null values
        APIHelper.cleanObject(message);

        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "POST",
            headers: headers,
            body: APIHelper.jsonSerialize(message),
            username: configuration.username,
            password: configuration.password,
            userStatus: vip
        };

        //Build the response processing. 
        var count = 0;

        function cb(error, response, context) {
            if (error) {
                count++
                if (count <= 3) {
                    requestClient(options, cb);
                } else {
                    callback({
                        errorMessage: error.message,
                        errorCode: error.code
                    }, null, context);
                }
            } else if (response.statusCode >= 200 && response.statusCode <= 206) {
                callback(null, JSON.parse(response.body), context);
            } else {
                count++
                if (count <= 3) {
                    requestClient(options, cb);
                } else {
                    //Error handling using HTTP status codes
                    if (response.body) {
                        var body = JSON.parse(response.body)
                    } else {
                        var body = response.body
                    }
                    if (response.statusCode == 401) {
                        callback({
                            errorMessage: "UNAUTHORIZED",
                            errorCode: 401,
                            errorResponse: body
                        }, null, context);
                    } else if (response.statusCode == 403) {
                        callback({
                            errorMessage: "FORBIDDEN",
                            errorCode: 403,
                            errorResponse: body
                        }, null, context);
                    } else if (response.statusCode == 429) {
                        request(options, cb);
                    } else {
                        callback({
                            errorMessage: "HTTP Response Not OK",
                            errorCode: response.statusCode,
                            errorResponse: body
                        }, null, context);
                    }
                }
            }
        }
        requestClient(options, cb);
    },


    /**
     * Lookup a Message by MDR
     * @param {string} recordId    Required parameter: Unique MDR ID
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    getMessageLookup: function(recordId, callback) {

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;

        var queryBuilder = baseUri + "/messages/{record_id}";

        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "record_id": recordId
        });

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);

        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "GET",
            username: configuration.username,
            password: configuration.password
        };

        //Build the response processing. 
        function cb(error, response, context) {
            if (error) {
                callback({
                    errorMessage: error.message,
                    errorCode: error.code
                }, null, context);
            } else if (response.statusCode >= 200 && response.statusCode <= 206) {
                callback(null, response.body, context);
            } else {
                //Error handling using HTTP status codes
                callback({
                    errorMessage: "HTTP Response Not OK",
                    errorCode: response.statusCode,
                    errorResponse: response.body
                }, null, context);
            }
        }
        request(options, cb);

    }

};

module.exports = MessagesController;