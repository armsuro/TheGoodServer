module.exports = {
    sendMessageToUser: function(req, res) {
        var saveInboundsLog = function(object) {
            object.company_id = req.user.company.id;
            InboundsLogs.create(object).exec(function(err, data) {
                Inbounds.update(object.inbounds_id, {
                    reviewed: 0,
                    createdAt: data.createdAt,
                    message: object.message
                }).then(function(data) {
                    return data;
                })
            })
        }
        var createNewInbound = function() {
            var data = req.body;
            Inbounds.create({
                    record_id: data.id,
                    message: data.message,
                    to: data.to,
                    from: data.from
                })
                .exec(function(err, checkGroup) {
                    if (err) return res.serverError(err);

                    saveInboundsLog(checkGroup, data)
                })
        }
        var msg = {
            "to": req.body.phone,
            "from": req.user.company.phone,
            "content": req.body.message
        };
        flowrouteMessaging.MessagesController.createMessage(msg, req.user.company.vip, function(err, response) {
            if (response) {
                Inbounds.findOne({
                    from: req.body.phone,
                    to: req.user.company.phone
                }).exec(function(err, data) {
                    if (data) {
                        var obj = {
                            inbounds_id: data.id,
                            phone: req.body.phone,
                            record_id: response.data.id,
                            message: req.body.message
                        }
                        saveInboundsLog(obj)
                    } else {
                        Inbounds.create({
                                record_id: response.data.id,
                                message: req.body.message,
                                to: req.body.phone,
                                from: req.user.company.phone
                            })
                            .exec(function(err, data) {
                                if (err) return res.serverError(err);
                                var obj = {
                                    inbounds_id: data.id,
                                    phone: req.body.phone,
                                    record_id: response.data.id,
                                    message: req.body.message
                                }
                                saveInboundsLog(obj)
                            })
                    }
                    res.json(true)
                })
            } else {
                res.json(false)
            }
        });
    },
    getInboundsByPhone: function(req, res) {
        InboundsLogs.find({
            phone: req.body.phone
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data);
        })
    },
    getInboundUserMessages: function(req, res) {
        Inbounds.update({
            id: req.body.id
        }, {
            reviewed: 1
        }).exec(function(err, data) {
            if (err) return res.serverError(err);

            InboundsLogs.update({
                inbounds_id: req.body.id
            }, {
                reviewed: 1
            }).exec(function(err, data) {
                if (err) return res.serverError(err);

                InboundsLogs.find({
                    inbounds_id: req.body.id
                }).exec(function(err, data) {
                    res.json(data);
                })
            })
        });
    },
    sendInbound: function(req, res) {
        var from = OtherHelper.filterNumber(req.body.from);
        var updateGroupUserStatus = function(company, from, status, message) {
            GroupUsers.update({
                company_id: company.id,
                phone: from
            }, {
                status: status
            }).exec(function(err, data) {
                if (err) console.log(err)
                if (data[0]) {
                    Message.send(from, req.body.to, data[0].id, data[0].group, company, null, message)
                }
            })
        }
        var saveInboundsLog = function(object) {
            InboundsLogs.create(object).exec(function(err, data) {
                if (data) {
                    object.reviewed = 0;
                    object.createdAt = data.createdAt;

                    sails.sockets.broadcast(req.body.to, "message", object);
                    Inbounds.update(object.inbounds_id, {
                        reviewed: 0,
                        createdAt: data.createdAt,
                        message: object.message
                    }).then(function(data) {
                        return data;
                    })
                }
            })
        }
        var replayMessage = function(groupData, company, groupUser) {
            if (groupData.replay_message) {
                Message.send(from, req.body.to, groupUser.id, groupData.id, company, groupData.replay_message, "welcome")
            } else {
                Message.send(from, req.body.to, groupUser.id, groupData.id, company, null, "welcome")
            }
        }
        var sendData = function(group) {
            Company.findOne({
                phone: req.body.to
            }).exec(function(err, company) {

                GroupUsers.findOne({
                    group_id: group.id,
                    company_id: company.id,
                    phone: from
                }).exec(function(err, groupUser) {
                    if (!groupUser) {
                        GroupUsers.findOne({
                            company_id: company.id,
                            phone: from
                        }).exec(function(err, data) {
                            var obj = {
                                group_id: group.id,
                                company_id: company.id,
                                phone: from
                            };
                            if (data) {
                                obj.full_name = data.full_name;
                            }
                            obj.created_type = "User sent reginstration keyword";
                            OtherHelper.createGroupUserLog({
                                group_id: group.id,
                                company_id: company.id,
                            }).exec(function(err, log) {
                                if (err) return res.serverError(err);
                            })
                            GroupUsers.create(obj).exec(function(err, data) {
                                if (data) {
                                    replayMessage(group, company, data);
                                    sails.sockets.broadcast(req.body.to, "newGroupUser", data);
                                }
                            })
                        })
                    } else if (groupUser && !groupUser.status) {
                        GroupUsers.update({
                            id: groupUser.id
                        }, {
                            status: 1
                        }).exec(function(err, data) {
                            if (err) return res.serverError(err);

                            replayMessage(group, company, data);
                            sails.sockets.broadcast(req.body.to, "newGroupUser", data);
                        })
                    }
                })
            })
        };

        var createNewInbound = function(company) {
            var data = req.body;
            Inbounds.create({
                    record_id: data.id,
                    message: data.body,
                    to: data.to,
                    from: data.from
                })
                .exec(function(err, checkData) {
                    if (err) return res.serverError(err);

                    var object = {
                        inbounds_id: checkData.id,
                        phone: from,
                        record_id: req.body.id,
                        message: req.body.body,
                        company_id: company.id,
                        user_message: 1
                    }
                    sails.sockets.broadcast(checkData.to, "newPhone", {
                        id: checkData.id,
                        message: checkData.message,
                        reviewed: checkData.reviewed,
                        createdAt: checkData.createdAt,
                        phone: checkData.from
                    });
                    saveInboundsLog(object)
                })
        }
        if (req.body.to && req.body.body && from && req.body.id) {
            Company.findOne({
                phone: req.body.to
            }).exec(function(err, company) {
                if (err) res.serverError(err)

                if (company && company.live_messaging) {
                    var count = company.vip ? 59 : 29;

                    if (req.body.body.toLowerCase() == "unstop") {
                        updateGroupUserStatus(company, from, 1, "welcome")
                    } else {
                        StopCodes.findOne({
                            code: req.body.body.toLowerCase()
                        }).exec(function(err, data) {
                            if (err) res.serverError(err)

                            if (data) {
                                updateGroupUserStatus(company, from, 0, "unstop")
                            }
                        })
                    }
                    request = require("request");
                    if (company.callback_url) {
                        request.post({
                            headers: {
                                'content-type': 'application/json'
                            },
                            url: company.callback_url,
                            method: 'POST',
                            json: req.body
                        }, function(error, response, body) {
                            if (error) console.log(error)
                        })
                    }
                    Groups.findOne({
                        company_id: company.id,
                        keyword: req.body.body.toLowerCase(),
                        status: 1
                    }).exec(function(err, data) {
                        if (data) {
                            sendData(data)
                        }
                    })

                    Inbounds.findOne({
                        to: req.body.to,
                        from: from
                    }).exec(function(err, data) {
                        if (data) {
                            var object = {
                                inbounds_id: data.id,
                                phone: from,
                                record_id: req.body.id,
                                message: req.body.body,
                                company_id: company.id,
                                user_message: 1
                            }

                            saveInboundsLog(object);
                        } else {
                            createNewInbound(company);
                        }
                    });
                }
            })
            res.json(200, true);
        } else {
            res.json(401, Msg.getMessage(401, "Validate Error"))
        }
    },
    getAllInbounds: function(req, res) {
        Inbounds.find({
            to: req.user.company.phone
        }).sort('createdAt DESC').exec(function(err, data) {
            if (err) return res.serverError(err);
            Promise.map(data, function(item) {
                return new Promise(function(resolve, reject) {

                    Company.findOne({
                        phone: item.to
                    }).then(function(company) {
                        GroupUsers.findOne({
                            phone: item.from,
                            company_id: company.id
                        }).then(function(user) {
                            var obj = {
                                id: item.id,
                                message: item.message,
                                reviewed: item.reviewed,
                                createdAt: item.createdAt,
                                phone: item.from
                            }

                            if (user) {
                                obj.full_name = user.full_name
                            }

                            return resolve(obj);
                        });
                    });
                });
            }).then(function(response) {

                res.json(response);
            });

        });
    },
    getBlockedAccounts: function(req, res) {
        var condition = {
            message: "stop",
            to: req.user.company.phone
        };
        if (req.body.start_date && req.body.end_date) {
            var endDate = new Date(req.body.end_date)
            endDate.setHours(23, 59, 59, 0);
            condition.createdAt = {
                '>': new Date(req.body.start_date),
                '<': endDate
            };
        }
        Inbounds.count(condition).exec(function(err, count) {
            Inbounds.find(condition, {
                select: ['from', 'createdAt']
            }).paginate({
                page: req.body.page.currentPage,
                limit: req.body.page.limit
            }).sort('id DESC').exec(function(err, data) {
                if (err) return res.serverError(err)
                Promise.map(data, function(item) {
                    return new Promise(function(resolve, reject) {
                        GroupUsers.findOne({
                            phone: item.from,
                            company_id: req.user.company.id
                        }).then(function(user) {
                            var obj = {
                                phone: item.from,
                                date: item.createdAt
                            }
                            if (user) {
                                obj.full_name = user.full_name
                            }
                            return resolve(obj);
                        });
                    });
                }).then(function(response) {
                    res.json(response);
                });
            })
        })
    },
    removeSubscriberToAllLists: function(req, res) {
        if (req.body.phone) {
            var number = OtherHelper.filterNumber(req.body.phone);
            GroupUsers.update({
                phone: number,
                company_id: req.user.company.id
            }, {
                status: 0
            }).exec(function(err, data) {
                if (err) return res.serverError(err);

                res.json(data);
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    dlr: function(req, res) {
        if (req.body.attributes) {
            DlrLogs.create({
                from: req.body.attributes.from,
                to: req.body.attributes.to,
                status: req.body.attributes.status,
                type: req.body.type,
                flowroute_id: req.body.id,
                body: req.body.attributes.body,
                status_code: req.body.attributes.status_code || null,
                json: JSON.stringify(req.body)
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(req.body)
            })
        }
    }
}