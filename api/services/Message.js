module.exports = {
    send: function(to, from, userId, groupId, company, message, messageCode) {
        var msg = {
            "to": to,
            "from": from,
        };
        var flowroute = function(message) {
            msg["content"] = message;
            flowrouteMessaging.MessagesController.createMessage(msg, company.vip, function(err, response) {
                if (response) {
                    GroupsUsersLogs.create({
                        group_id: groupId,
                        user_id: userId,
                        sent_type: 1,
                        record_id: response.data.id

                    }).exec(function(err, data) {
                        return true;
                    })
                } else {
                    return false;
                }
            })
        }
        ReplayMessages.findOne({
            code: messageCode
        }).exec(function(err, data) {
            if (err) console.log(err)
            if (data.status) {
                if (message) {
                    flowroute(OtherHelper.filterCompanyName(data.message, company.name));
                    flowroute(message);
                } else {
                    flowroute(OtherHelper.filterCompanyName(data.message, company.name));
                }
            }
        })
    },
    sentCampain: function(reqUser, body, schedule, schedule_time) {
        var finishedRequests = 0;
        var allSubscribersCount = 0;
        var sendFinish = function(log_id) {
            finishedRequests++;
            if (finishedRequests == allSubscribersCount) {
                GroupsLogs.update({
                    id: log_id
                }, {
                    send_all_users: 1
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    sails.sockets.broadcast(reqUser.company.phone, "finishMessages", {
                        report_id: log_id
                    });
                })
            }
        }
        var send = function(users, group, log_id) {
            var sendedCount = 0;
            var notSendedCount = 0;
            allSubscribersCount = allSubscribersCount == 0 ? users.length : allSubscribersCount + users.length;
            Promise.map(users, function(user) {
                var msg = {
                    "to": user.phone,
                    "from": reqUser.company.phone,
                    "content": body.message
                };
                flowrouteMessaging.MessagesController.createMessage(msg, reqUser.company.vip, function(err, response) {
                    if (response) {
                        GroupsUsersLogs.create({
                                group_id: group.id,
                                company_id: reqUser.company.id,
                                log_id: log_id,
                                user_id: user.id,
                                record_id: response.data.id
                            })
                            .exec(function(err, data) {
                                sendedCount = sendedCount + 1;
                                sails.sockets.broadcast(reqUser.company.phone, "groupSendedMessages", {
                                    id: group.id,
                                    sent_subscribers: sendedCount,
                                    list_name: group.name,
                                    all_subscribers: allSubscribersCount,
                                    report_id: log_id
                                });

                                sendFinish(log_id)
                            })
                    } else {
                        GroupsUsersLogs
                            .create({
                                group_id: group.id,
                                log_id: log_id,
                                user_id: user.id,
                                sent_type: 0
                            }).exec(function(err, log) {
                                sendFinish(log_id)
                            });
                    }
                });
            }).then(function(success) {})
        }
        var start = function() {
            var log_id
            Groups.find({
                id: body.groups
            }).populate('groupUsers', {
                status: 1
            }).exec(function(err, groups) {
                OtherHelper.groupUsersUnique(groups).then(function(data) {
                    GroupsLogs.create({
                        group_ids: body.groups,
                        message: body.message,
                        quiz: 0,
                        dublicate_numbers: data['dublicate_numbers'],
                        company_id: reqUser.company.id,
                        name: body.name ? body.name : '',
                        schedule_time: schedule_time ? schedule_time : null
                    }).then(function(groupLog) {
                        log_id = groupLog.id
                        Promise.map(data['groups'], function(group) {
                            if (body.urls) {
                                for (i in body.urls) {
                                    var encrypt = body.urls[i].split('/')[2];
                                    LinkTracker.create({
                                        group_id: group.id,
                                        message_id: log_id,
                                        url: i,
                                        encrypt: encrypt
                                    }).exec(function(err, data) {
                                        if (err) console.log(err);
                                    })
                                }
                            }
                            send(group.groupUsers, group, log_id)
                        })
                    });
                })
            })
        }
        if (schedule) {
            body.urls = body.urls ? JSON.parse(body.urls) : ""
            body.groups = body.groups.split(",")
            Company.findOne(body.company_id).exec(function(err, data) {
                reqUser["company"] = data;

                start();
            })
        } else {
            start()
        }
    }
};