/**
 * @module FlowrouteMessagingLib
 *  
 * Flowroute SMS Beta SDK
 */

var configuration = require('./configuration'),
    MessagesController = require('./Controllers/MessagesController'),
    Message = require('./Models/Message');


var getFirst = function(obj) {
    for (var i in obj) return obj[i];
};


function initializer() {}


initializer.Broadcast = function(msg, vip, onPrepared) {
    var message = new Message();

    message.setFrom(msg.from);
    message.setContent(msg.content);

    onPrepared();

    return {
        responses: [],
        package: message,
        To: function(list, format) {
            var service = this;

            var callbacks = {
                onProcess: function(response) {},
                onSuccess: function(response) {},
                onFail: function(response) {},
                onFinish: function(response) {}
            };

            var phones = (typeof format == "function") ? list.map(format) : list.map(getFirst);

            var finishedRequests = 0;
            var estimatedRequests = phones.length;

            var sendNextMessageRequest = function() {
                if (phones.length) {
                    configuration.msgProcessLimit = vip ? 60 : 30;
                    if (configuration.msgOnProcess < configuration.msgProcessLimit) {
                        configuration.msgOnProcess++;

                        service.package.setTo(phones.pop());
                        callbacks.onProcess(service.package.toJSON());

                        (function(element) {
                            MessagesController.createMessage(service.package.toJSON(), vip, function(err, response) {
                                finishedRequests++;
                                configuration.msgOnProcess--;

                                if (err) callbacks.onFail(err, element);
                                if (response && !response.errorMessage)
                                    callbacks.onSuccess(element, response)
                                else
                                    callbacks.onFail(element, response)
                                element.response = response;
                                service.responses.push(element);
                                return sendNextMessageRequest();
                            });
                        })(list[phones.length]);

                        sendNextMessageRequest();
                    }
                } else if (finishedRequests == estimatedRequests) {
                    callbacks.onFinish(service.responses);
                }
            };

            sendNextMessageRequest();

            return Object.keys(callbacks).reduce(function(listeners, newListenerName) {
                listeners[newListenerName] = function(cb) {
                    callbacks[newListenerName] = cb;
                    return listeners;
                };
                return listeners;
            }, {});

        }
    }
}
initializer.Message = Message;
initializer.MessagesController = MessagesController;
module.exports = initializer;