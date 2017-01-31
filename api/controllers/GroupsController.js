module.exports = {
    getAllGroups: function(req, res) {
        Groups.query("SELECT g.name, g.keyword , g.author_id , g.replay_message , g.company_id , g.status, g.created_at, g.id, COUNT(gu.id) as subscribers_count FROM `groups` as g LEFT JOIN group_users as gu ON gu.group_id = g.id AND gu.status = 1 WHERE g.status = 1 AND g.company_id = ? GROUP BY g.name, g.keyword , g.author_id , g.replay_message , g.company_id , g.status, g.created_at, g.id ORDER BY g.id DESC", [req.user.company.id], function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getAllList: function(req, res) {
        Groups.query("SELECT g.id, g.name, COUNT(gu.id) as subscribers_count FROM `groups` as g LEFT JOIN group_users as gu ON gu.group_id = g.id AND gu.status = 1 WHERE g.status = 1 AND g.company_id = ? GROUP BY g.name, g.id ORDER BY g.id DESC", [req.user.company.id], function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    createGroup: function(req, res) {
        var data = req.body;
        data.company_id = req.user.company.id;
        data.author_id = req.user.id;
        var condition = {}
        if (data.name && data.keyword)
            condition = {
                or: [{
                    name: data.name
                }, {
                    keyword: data.keyword
                }]
            }
        else if (data.name)
            condition = {
                name: data.name
            }
        else
            res.json(401, Msg.getMessage(401, "Group name required"));

        Groups.findOne({
            company_id: req.user.company.id,
            status: 1
        }).where(condition).exec(function(err, groupData) {
            if (err) return res.serverError(err)

            if (!groupData) {
                if (data.keyword) data.keyword = data.keyword.toLowerCase()
                Groups.create(data).exec(function(err, data) {
                    if (err) res.serverError(err);

                    res.json(data);
                });
            } else {
                res.json(401, Msg.getMessage(401, "Group name and keyword unique values"));
            }
        })
    },
    updateGroup: function(req, res) {
        Groups.findOne({
            id: req.body.id
        }).exec(function(err, data) {
            if (data.keyword == req.body.keyword && data.name == req.body.name) {
                Groups.update({
                    id: req.body.id
                }, {
                    replay_message: req.body.replay_message
                }).exec(function(err, data) {
                    if (err) res.serverError(err);

                    res.json(data);
                });
            } else {
                var condition = {}

                if (req.body.name != data.name && req.body.keyword != data.keyword)
                    condition = {
                        or: [{
                            name: req.body.name
                        }, {
                            keyword: req.body.keyword
                        }]
                    }
                else if (req.body.name == data.name && req.body.keyword != data.keyword)
                    condition = {
                        keyword: req.body.keyword
                    }
                else if (req.body.name != data.name && req.body.keyword == data.keyword)
                    condition = {
                        name: req.body.name
                    }

                Groups.findOne({
                    company_id: req.user.company.id,
                    status: 1
                }).where(condition).exec(function(err, groupData) {
                    if (err) return res.serverError(err)
                    req.body.keyword = req.body.keyword ? req.body.keyword.toLowerCase() : ""
                    if (!groupData) {
                        Groups.update(req.body.id, {
                            name: req.body.name,
                            keyword: req.body.keyword,
                            replay_message: req.body.replay_message
                        }).exec(function(err, data) {
                            if (err) res.serverError(err);

                            res.json(data);
                        });
                    } else {
                        res.json(401, Msg.getMessage(401, "Group name and keyword unique values"));
                    }
                })
            }
        })

    },
    removeGroup: function(req, res) {
        Groups.update({
            id: req.body.id
        }, {
            status: 0
        }).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    },
    addGroupUser: function(req, res) {
        var body = req.body
        body.company_id = req.user.company.id;
        body.created_type = "Supscriber created in supscribers page";
        GroupUsers.findOne({
            group_id: body.group_id,
            company_id: body.company_id,
            phone: OtherHelper.filterNumber(body.phone)
        }).exec(function(err, groupData) {
            if (err) return res.serverError(err);

            if (!groupData) {
                GroupUsers.create(body).exec(function(err, data) {
                    if (err) return res.serverError(err);

                    if (data) {
                        GroupUsers.update({
                            company_id: body.company_id,
                            phone: OtherHelper.filterNumber(body.phone)
                        }, {
                            full_name: body.full_name
                        }).exec(function(err, data) {
                            if (err) return res.serverError(err)

                            res.json(data);
                        })
                    }
                });
            } else if (!groupData.status) {
                GroupUsers.update({
                    id: groupData.id
                }, {
                    status: 1,
                    full_name: req.body.full_name
                }).exec(function(err, data) {
                    if (err) return res.serverError(err);

                    res.json(data)
                })
            } else {
                res.json(409, Msg.getMessage(409, "This phone number to subscribers already exist."))
            }
        })

    },
    sendIndividual: function(req, res) {
        var sendMessage = function(insertObj, groupUser) {
            var msg = {
                "to": insertObj.phone,
                "from": req.user.company.phone,
                "content": req.body.message
            };
            flowrouteMessaging.MessagesController.createMessage(msg, req.user.company.vip, function(err, response) {
                if (response) {
                    GroupsLogs.create({
                        group_ids: insertObj.group_id,
                        message: req.body.message,
                        quiz: 0,
                        company_id: req.user.company.id,
                        send_all_users: 1,
                        name: req.user.company.name + " " + moment(new Date()).format('YYYY-MM-DD HH:mm')
                    }).then(function(logData) {
                        GroupsUsersLogs.create({
                                group_id: insertObj.group_id,
                                company_id: req.user.company.id,
                                log_id: logData.id,
                                user_id: groupUser.id,
                                record_id: response.data.id
                            })
                            .exec(function(err, data) {
                                res.json(data)
                            })
                    })
                } else {
                    res.json(false)
                }
            });
        }

        var createUser = function(data) {
            var insertObj = {
                group_id: data.id,
                full_name: req.body.first_name + " " + req.body.last_name,
                reference_id: req.body.reference_id,
                phone: OtherHelper.filterNumber(req.body.phone),
                company_id: req.user.company.id,
                created_type: "Supscriber created by sendIndividual api"
            }
            GroupUsers.findOne({
                group_id: insertObj.group_id,
                company_id: req.user.company.id,
                phone: insertObj.phone
            }).exec(function(err, groupUser) {
                if (err) return res.serverError(err);

                if (!groupUser) {
                    OtherHelper.createGroupUserLog({
                        group_id: insertObj.group_id,
                        company_id: req.user.company.id,
                        user_id: req.user.id
                    }).exec(function(err, log) {
                        if (err) return res.serverError(err);

                        GroupUsers.create(insertObj).exec(function(err, userData) {
                            if (err) return res.serverError(err);

                            sendMessage(insertObj, userData);
                        });
                    })
                } else {
                    sendMessage(insertObj, groupUser);
                }
            })
        }
        if (req.body.phone && req.body.list_name) {
            Groups.findOrCreate({
                name: req.body.list_name,
                status: 1
            }, {
                name: req.body.list_name,
                author_id: req.user.id,
                company_id: req.user.company.id
            }).exec(function(err, data) {
                if (err) return res.serverError(err);
                createUser(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }

    },
    deleteGroupUser: function(req, res) {
        GroupUsers.update({
            "id": req.body.id
        }, {
            status: 0
        }).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    },
    updateGroupUser: function(req, res) {
        GroupUsers.update({
            id: req.body.id
        }, req.body).exec(function(err, data) {
            if (err) res.serverError(err);

            if (data) {
                GroupUsers.update({
                    company_id: data.company_id,
                    phone: data.phone
                }, {
                    full_name: data.full_name
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    res.json(data);
                })
            }
        });
    },
    sendMessageAllGroupUsers: function(req, res) {
        if (req.body.groups && req.body.message) {
            Message.sentCampain(req.user, req.body, false);
            res.json(true)
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getAllLogs: function(req, res) {
        GroupsLogs.find().exec(function(err, data) {
            if (err) return res.json(err)

            res.json(data);
        });
    },
    sendMessagesAgain: function(req, res) {
        if (req.body.log_id) {
            if (req.user.role == SURPER_ADMIN_ROLE_ID) {
                var phone = req.body.phone;
                var vip = req.body.vip;
            } else {
                var phone = req.user.company.phone;
                var vip = req.user.company.vip;
            }
            var log_id = req.body.log_id;
            GroupsUsersLogs.find({
                log_id: log_id
            }, {
                select: ['id', 'log_id', 'group_id', 'user_id', 'sent_type']
            }).populate('group').exec(function(err, groupLogs) {
                if (err) return res.serverError(err);

                if (groupLogs[0]) {
                    var ids = []
                    for (i in groupLogs) {
                        if (groupLogs[i].sent_type) {
                            ids.push(groupLogs[i].user);
                        }
                    }
                    if (ids.length) {

                        GroupUsers.find({
                            status: 1,
                            id: {
                                '!': [ids]
                            },
                            group_id: groupLogs[0].group.id
                        }).exec(function(err, groupBouncedUser) {
                            if (err) return res.serverError(err)
                            var groupUsers = [];

                            if (groupLogs[0].group) {
                                var groupId = groupLogs[0].group.id;
                                var groupName = groupLogs[0].group.name
                            }

                            var sendedCount = 0;
                            var notSendedCount = 0;
                            for (i in groupBouncedUser) {
                                groupUsers.push({
                                    id: groupBouncedUser[i].id,
                                    phone: groupBouncedUser[i].phone
                                })
                            }

                            var allSubscribersCount = groupUsers.length;

                            flowrouteMessaging.Broadcast({
                                    "from": phone,
                                    "content": req.body.message
                                }, vip, function onPrepared() {
                                    GroupsLogs.update({
                                        id: log_id
                                    }, {
                                        createdAt: new Date()
                                    }).exec(function(err, data) {
                                        if (err) console.log(err)
                                    })
                                }).To(groupUsers, function(el) {
                                    return el.phone
                                })
                                .onSuccess(function(res, data) {
                                    GroupsUsersLogs.findOne({
                                        log_id: log_id,
                                        user_id: res.id
                                    }).exec(function(err, userRecord) {
                                        if (!userRecord) {
                                            GroupsUsersLogs
                                                .create({
                                                    log_id: log_id,
                                                    user_id: res.id,
                                                    sent_type: true,
                                                    record_id: data.id ? data.id : '',
                                                    group_id: groupId,
                                                }).exec(function(err, log) {
                                                    sendedCount = sendedCount + 1;
                                                    sails.sockets.broadcast(phone, "groupSendedMessages", {
                                                        id: groupId,
                                                        list_name: groupName,
                                                        sent_subscribers: sendedCount,
                                                        all_subscribers: allSubscribersCount,
                                                        report_id: log_id
                                                    });
                                                });
                                        } else {
                                            GroupsUsersLogs
                                                .update({
                                                    log_id: log_id,
                                                    user_id: res.id
                                                }, {
                                                    sent_type: 1,
                                                    record_id: data.id ? data.id : ''
                                                }).exec(function(err, log) {
                                                    sendedCount = sendedCount + 1;
                                                    sails.sockets.broadcast(phone, "groupSendedMessages", {
                                                        id: groupId,
                                                        list_name: groupName,
                                                        sent_subscribers: sendedCount,
                                                        all_subscribers: allSubscribersCount,
                                                        report_id: log_id
                                                    });
                                                });
                                        }
                                    })
                                })
                                .onFail(function(res, data) {
                                    GroupsUsersLogs.findOne({
                                        log_id: log_id,
                                        user_id: res.id
                                    }).exec(function(err, userRecord) {
                                        if (!userRecord) {
                                            GroupsUsersLogs
                                                .create({
                                                    log_id: log_id,
                                                    user_id: res.id,
                                                    sent_type: 0
                                                }).exec(function(err, log) {})
                                        }
                                    })

                                })
                                .onFinish(function(response) {
                                    GroupsLogs.update({
                                        id: log_id
                                    }, {
                                        send_all_users: 1
                                    }).exec(function(err, data) {
                                        if (err) return res.serverError(err)

                                        sails.sockets.broadcast(phone, "finishMessages", {
                                            report_id: log_id
                                        });
                                    })
                                });

                            res.json(true)
                        })
                    } else {
                        res.json(400, Msg.getMessage(400))
                    }
                } else {
                    res.json(400, Msg.getMessage(400))
                }
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getGroupUsers: function(req, res) {
        if (req.body.page) {
            var condition = {
                group_id: req.body.group_id,
                status: 1
            };
            if (req.body.page.search) {
                condition['or'] = [{
                    like: {
                        full_name: '%' + req.body.page.search + '%'
                    }
                }, {
                    like: {
                        phone: '%' + OtherHelper.filterNumber(req.body.page.search) + '%'
                    }
                }]
            }
            Groups.findOne({
                id: req.body.group_id
            }).exec(function(err, group) {
                GroupUsers.count(condition).exec(function(err, count) {
                    if (err) return res.serverError(err)

                    var obj = {
                        'count': count,
                        'data': [],
                        'list_name': group.name
                    }

                    GroupUsers.find(condition).paginate({
                        page: req.body.page.currentPage,
                        limit: req.body.page.limit
                    }).sort('id DESC').exec(function(err, data) {
                        if (err) res.serverError(err);

                        obj.data = data;
                        res.json(obj);
                    });
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getNewMessages: function(req, res) {
        Inbounds.count({
            reviewed: 0
        }).exec(function(err, data) {
            if (err) return res.serverError(err);

            res.json(data);
        })
    },
    getGroupsNewUsers: function(req, res) {
        Groups.getUserGroups(req.user.company.id).then(function(ids) {
            var condition = {
                group_id: ids
            };
            bodyData = req.body;
            if (bodyData.start_date && bodyData.end_date) {
                var endDate = new Date(bodyData.end_date)
                endDate.setHours(23, 59, 59, 0);
                condition.createdAt = {
                    '>': new Date(bodyData.start_date),
                    '<': endDate
                };

            } else {
                var month = new Date();
                month.setDate(1);
                month.setHours(0, 0, 0, 0);
                condition.createdAt = {
                    '>': month
                };
            }

            GroupUsers.count(condition).exec(function(err, count) {
                if (err) return res.serverError(err);
                var obj = {
                    'count': count,
                    'data': []
                }
                GroupUsers.find(condition).populate("group", {
                    select: ['name']
                }).paginate({
                    page: req.body.page.currentPage,
                    limit: req.body.page.limit
                }).exec(function(err, data) {
                    if (err) return res.serverError(err);

                    for (i in data) {
                        if (data[i].group) {
                            data[i].group_name = data[i].group.name;
                            delete data[i].group;
                        }
                    }
                    obj.data = data;

                    res.json(obj);
                })
            })
        })
    },
    getReportsData: function(req, res) {
        var company_id = req.user.role == SURPER_ADMIN_ROLE_ID ? req.body.company_id : req.user.company.id

        if (req.body.page && req.body.date && req.body.date.start_date && req.body.date.end_date && req.body.page.currentPage && req.body.page.limit) {
            GroupsLogs.query("SELECT COUNT(*) as count FROM group_logs WHERE DATE(created_at) BETWEEN ? AND ? AND company_id = ? ", [moment(new Date(req.body.date.start_date)).format("YYYY-MM-DD"), moment(new Date(req.body.date.end_date)).format("YYYY-MM-DD"), company_id], function(err, count) {
                if (err) return res.serverError(err)

                var conditionString = req.body.quiz ? "AND gl.quiz != 0" : "AND gl.quiz = 0";
                var params = [company_id];
                if (req.body.date.start_date && req.body.date.end_date) {
                    conditionString += " AND gl.created_at BETWEEN ? AND ?";
                    params.push(moment(new Date(req.body.date.start_date + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(req.body.date.end_date + " 23:59:59")).format('YYYY-MM-DD HH:mm:ss'));
                }
                var query = 'SELECT gl.send_all_users, gl.message, gl.schedule_time, gl.quiz AS quiz_id, gl.quiz_code AS quiz_code, gl. NAME AS campaign_name, gl.id, Date_format( gl.created_at, "%b %d %Y %h:%i %p") AS sent_date,( SELECT Count(group_users_logs.id) FROM group_users_logs WHERE log_id = gl.id ) AS subscribers_count, ( SELECT Count(group_users_logs.id) FROM group_users_logs WHERE log_id = gl.id AND sent_type = 1 ) AS delivered_count FROM group_logs gl WHERE gl.company_id = ? ' + conditionString + ' GROUP BY gl.quiz, gl.send_all_users, gl.message, gl. NAME, gl.id, date_format( gl.created_at, "%b %d %Y %h:%i %p" ) ORDER BY gl.id DESC ' + OtherHelper.pagInation(req.body.page.currentPage, req.body.page.limit);
                GroupsLogs.query(query, params, function(err, data) {
                    if (err) return res.serverError(err);

                    res.json({
                        count: count[0].count,
                        data: data
                    });
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getReportData: function(req, res) {
        if (req.body.id) {
            if (req.body.quiz_id) {
                var query = 'SELECT Date_format( gl.created_at, "%b %d %y %h:%i %p") AS sent_date, gl.id, gl.schedule_time, gl. NAME AS campaign_name, gl.message, gl.quiz, gl.quiz_code, g. NAME AS list_name,( SELECT Count(group_users_logs.id) FROM group_users_logs WHERE log_id = gl.id AND sent_type = 1 ) AS subs_del, ( SELECT Count(quiz_answers.id) FROM quiz_answers WHERE quiz_answers.quiz_code = gl.quiz_code ) AS answers_count, ( SELECT Count(group_users_logs.id) FROM group_users_logs WHERE log_id = gl.id ) AS subs_count FROM group_logs AS gl LEFT JOIN groups AS g ON g.id = gl.group_id WHERE gl.id = ? GROUP BY gl. NAME, gl.message';
                GroupsLogs.query(query, [req.body.id], function(err, data) {
                    if (err) return res.serverError(err)

                    QuizQuestions.query('SELECT question, code,(SELECT COUNT(*) FROM quiz_answers WHERE answer_code = code AND quiz_code = ?) as count FROM quiz_questions WHERE status = 1 AND quiz_id = ?', [data[0].quiz_code, req.body.quiz_id], function(err, answers) {
                        if (err) return res.serverError(err)

                        if (data[0] && answers) {
                            data[0]['answers'] = answers;
                            data[0]['quiz_report'] = true;
                            res.json(data[0]);
                        } else
                            res.json(401, Msg.getMessage(401, "Report not exist"))
                    })
                });
            } else {

                var query = 'SELECT Date_format( gl.created_at, "%b %d %y %h:%i %p") AS sent_date, gl.dublicate_numbers, gl.group_ids, gl.schedule_time, Count(DISTINCT lk_logs.id) AS link_click_count, gl.id, gl. NAME AS campaign_name, gl.message, Count(DISTINCT lk.id) AS subs_link,( SELECT Count(group_users_logs.id) FROM group_users_logs WHERE log_id = gl.id AND sent_type = 1 ) AS subs_del, ( SELECT Count(group_users_logs.id) FROM group_users_logs WHERE log_id = gl.id ) AS subs_count FROM group_logs AS gl LEFT JOIN link_tracker AS lk ON lk.message_id = gl.id LEFT JOIN link_tracker_logs AS lk_logs ON lk_logs.link_id = lk.id WHERE gl.id = ? GROUP BY gl.id, gl. NAME, gl.message, gl.dublicate_numbers, gl.group_ids';
                GroupsLogs.query(query, [req.body.id], function(err, data) {
                    if (err) return res.serverError(err)

                    if (data[0]) {
                        Groups.find({
                            id: data[0].group_ids.split(',')
                        }).exec(function(err, groups) {
                            if (err) return res.serverError(err)
                            var listNames = groups.map(function(item) {
                                return item.name
                            })
                            data[0]["list_names"] = listNames
                            res.json(data[0]);
                        })
                    } else
                        res.json(401, Msg.getMessage(401, "Report not exist"))
                });
            }

        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    importSubscribers: function(req, res) {
        createData = function(groupId) {
            var usersReturnData = [];
            Promise.map(req.body.subscribers, function(user) {
                if (user.phone) {
                    user.phone = user.phone.toString();
                    if ([10, 11].indexOf(user.phone.length) >= 0 && !isNaN(user.phone * 1)) {
                        user.phone = OtherHelper.filterNumber(user.phone);
                        user.company_id = req.user.company.id;
                        user.group_id = groupId;
                        return GroupUsers.findOne({
                            group_id: user.group_id,
                            phone: user.phone
                        }).then(function(data) {
                            if (data) return usersReturnData.push(user)

                            else {
                                user.created_type = "Import supscribers in textarea";
                                return GroupUsers.create(user).then(function() {}, function(err) {
                                    return usersReturnData.push(user)
                                })
                            }
                        }, function(err) {
                            return usersReturnData.push(user)
                        })
                    } else {
                        return usersReturnData.push(user)
                    }
                }
            }).then(function(response) {
                res.json(usersReturnData);
            })
        }
        if (req.body.group_id) {
            createData(req.body.group_id)
        } else if (req.body.list_name) {
            Groups.findOrCreate({
                name: req.body.list_name,
                company_id: req.user.company.id,
                status: 1
            }, {
                name: req.body.list_name,
                company_id: req.user.company.id,
                author_id: req.user.id
            }).exec(function(err, data) {
                if (err) res.serverError(err)

                if (data) {
                    createData(data.id)
                }
            })
        } else {
            res.json(401, Msg.getMessage(401))
        }
    },
    getSubsByType: function(req, res) {
        if (req.body.id && req.body.page) {
            req.body.page.currentPage = req.body.page.currentPage ? req.body.page.currentPage : 1;
            req.body.page.limit = req.body.page.limit ? req.body.page.limit : 10;

            var condition = {
                log_id: req.body.id
            };
            if (req.body.type == 'del')
                condition['sent_type'] = 1;
            else if (req.body.type == 'boun')
                condition['sent_type'] = 0;

            GroupsUsersLogs.count(condition).exec(function(err, count) {
                if (err) return res.serverError(err)

                var obj = {
                    'count': count,
                    'data': []
                }
                GroupsUsersLogs.find(condition, {
                    select: ['id', 'user']
                }).paginate({
                    page: req.body.page.currentPage,
                    limit: req.body.page.limit
                }).sort('id DESC').populate('user', {
                    select: ['id, full_name, phone']
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    var userData = [];
                    for (var i in data) {
                        var userObj = {
                            "phone": data[i].user.phone
                        }

                        if (data[i].user.full_name) {
                            userObj['full_name'] = data[i].user.full_name
                        }
                        userData.push(userObj)
                    }
                    obj.data = userData;
                    res.json(obj);
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    importCSVfile: function(req, res) {
        var userReturnData = [];
        var length = 0;
        var insert = [];
        var loopCount = 0;
        var sendFinish = function() {
            loopCount++
            if (length == loopCount) {
                sails.sockets.broadcast(req.user.company.phone, "fileUploadFinished", userReturnData)
                GroupUsers.create(insert).then(function() {})
            }
        }
        if (req.body.group_id && req.body.file_name && req.body.data) {
            Groups.findOne({
                id: req.body.group_id,
                status: 1
            }).exec(function(err, data) {
                if (err) return res.serverError(err);

                if (data) {
                    var bodyData = req.body.data;
                    var data = fs.readFileSync(path.join(__dirname, '../../protected_files/exel_files/' + req.body.file_name), {
                        encoding: 'utf8'
                    });

                    var options = {
                        delimiter: ','
                    };

                    var array = csvjson.toArray(data, options);
                    if (req.body.data.header) array.splice(0, 1);
                    length = array.length;
                    Promise.map(array, function(data) {
                        var user = {};

                        if (bodyData.phone) {

                            if (bodyData.first_name && bodyData.last_name) {
                                user = {
                                    full_name: data[bodyData.first_name] + ' ' + data[bodyData.last_name],
                                    phone: data[bodyData.phone]
                                }
                            } else if (bodyData.first_name) {
                                user = {
                                    full_name: data[bodyData.first_name],
                                    phone: data[bodyData.phone]
                                }
                            } else if (bodyData.last_name) {
                                user = {
                                    full_name: data[bodyData.last_name],
                                    phone: data[bodyData.phone]
                                }
                            } else {
                                user = {
                                    phone: data[bodyData.phone]
                                }
                            }

                            if (user.phone) {
                                user.created_type = "Import in CSV file";
                                user.phone = OtherHelper.filterNumber(user.phone);
                                if ([10, 11].indexOf(user.phone.length) >= 0 && !isNaN(user.phone * 1)) {
                                    user.company_id = req.user.company.id;
                                    user.group_id = req.body.group_id;
                                    return GroupUsers.findOne({
                                        group_id: user.group_id,
                                        phone: user.phone
                                    }).then(function(data) {
                                        if (data && data.status) {
                                            userReturnData.push(user)
                                            sendFinish()
                                        } else if (data && data.status) {
                                            GroupUsers.update({
                                                group_id: user.group_id,
                                                phone: user.phone
                                            }, {
                                                status: 1
                                            }).then(function(data) {
                                                sendFinish()
                                            })
                                        } else {
                                            insert.push(user)
                                            sendFinish()
                                        }
                                    }, function(err) {
                                        userReturnData.push(user)
                                        sendFinish()
                                    })
                                } else {
                                    userReturnData.push(user)
                                    sendFinish()
                                }
                            } else {
                                userReturnData.push(user)
                                sendFinish()
                            }
                        } else {
                            userReturnData.push(user)
                            sendFinish()
                        }
                    })

                    res.json(200, Msg.getMessage(200));
                } else {
                    res.json(405, Msg.getMessage(405, "Note exist file"))
                }
            })

        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    uploadExel: function(req, res) {
        req.file('file').upload({
            dirname: '../../protected_files/exel_files/',
            saveAs: "f" + Date.now()
        }, function(err, uploadedFiles) {
            if (err) return res.serverError(err);

            if (uploadedFiles) {
                var fileName = uploadedFiles[0].fd.split("exel_files/")[1];

                res.json({
                    file_name: fileName,
                    success: true
                });
            }
        });
    },
    readExelFile: function(req, res) {
        if (req.body.file_name) {
            if (fs.existsSync(path.join(__dirname, '../../protected_files/exel_files/' + req.body.file_name))) {
                var data = fs.readFileSync(path.join(__dirname, '../../protected_files/exel_files/' + req.body.file_name), {
                    encoding: 'utf8'
                });
                var options = {
                    delimiter: ','
                };

                var array = csvjson.toArray(data, options);

                res.json(array.slice(0, 5));

            } else {
                res.json(405, Msg.getMessage(405, "Note exist file"))
            }
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    createConfirmLog: function(req, res) {
        if (req.body.group_id && req.body.message) {
            OtherHelper.createGroupUserLog({
                group_id: req.body.group_id,
                company_id: req.user.company.id,
                user_id: req.user.id,
                message: req.body.message
            }).exec(function(err, log) {
                if (err) return res.serverError(err);

                res.json(Msg.getMessage(200))
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    sendSubscriberList: function(req, res) {
        if (req.body.list_name && req.body.message) {
            Groups.findOne({
                name: req.body.list_name,
                status: 1,
                company_id: req.user.company.id
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                if (data) {
                    Message.sentCampain(req.user, {
                        message: req.body.message,
                        groups: data.id,
                        name: req.user.company.name + " " + moment(new Date()).format('YYYY-MM-DD HH:mm')
                    }, false);
                    res.json(Msg.getMessage(200))
                } else {
                    res.json(Msg.getMessage(400))
                }
            })
        } else {
            res.json(Msg.getMessage(400))
        }
    }
}