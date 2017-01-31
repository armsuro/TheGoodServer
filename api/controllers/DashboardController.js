var month = new Date();
month.setDate(1);
month.setHours(0, 0, 0, 0);

module.exports = {
    getAppInfo: function(req, res) {
        async.parallel({
            "Inbounds": InboundsLogs.getInboundsCount(month, req.user.company.id),
            "GroupUsers": GroupUsers.newGoupUsersCounts(month, req.user.company.id),
            "MessagesCount": InboundsLogs.getMessagesCount(month, req.user.company),
            "deactivated": Inbounds.getDeactivatedUsersCount(month, req.user.company.phone)
        }, function(err, data) {
            if (err) return res.serverError(err);

            res.json(data);
        });
    },
    messagesChapter: function(req, res) {
        async.parallel({
            "Live Messaging": InboundsLogs.getInboundsCount(month, req.user.company.id),
            "Messages": GroupsUsersLogs.messagesCounts(month, req.user.company.id)
        }, function(err, data) {
            if (err) return res.serverError(err);

            res.json(data);
        });
    },
    getSbsProgressData: function(req, res) {
        GroupUsers.find({
            'created_at': {
                '>': month
            },
            'company_id': req.user.company.id,
            status: 1
        }).exec(function(err, users) {
            if (err) res.serverError(err)
            var dates = {};
            for (i in users) {
                var date = new Date(users[i].createdAt);
                var day = date.getDate();
                if (dates[day]) {
                    dates[day] = dates[day] + 1;
                } else {
                    dates[day] = 1;
                }
            }
            res.json(dates)
        })
    },
    getTopLinkData: function(req, res) {
        Groups.getUserGroups(req.user.company.id).then(function(ids) {
            LinkTeackerLogs.query('SELECT `url`, COUNT(*) as count FROM `link_tracker_logs` WHERE `group_id` in (' + ids + ') GROUP BY url ORDER BY count DESC LIMIT 5', function(err, data) {
                var chart = {}
                for (i in data) {
                    var url = data[i].url;
                    chart[url] = data[i]["count"];
                }
                res.json(chart);
            });
        });
    },
    getAllCompanys: function(req, res) {
        Company.find().exec(function(err, data) {
            res.json(data)
        })
    },
    getCampaignProgressData: function(req, res) {
        GroupsLogs.find({
            'created_at': {
                '>': month
            },
            'company_id': req.user.company.id,
            'quiz': 0
        }).populate('groupsUsersLogs', {
            where: {
                sent_type: 1
            }
        }).exec(function(err, data) {
            if (err) return res.serverError(err);

            var dates = {};
            for (i in data) {
                var date = new Date(data[i].createdAt);
                var day = date.getDate();
                if (dates[day]) {
                    dates[day] = dates[day] + data[i].groupsUsersLogs.length;
                } else {
                    dates[day] = data[i].groupsUsersLogs.length;
                }
            }
            res.json(dates);
        })
    },
    sendContuctUs: function(req, res) {
        if (req.body.email && req.body.message) {
            ContuctUs.create(req.body).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            req.json(401, Msg.getMessage(401, "Email or message required"))
        }
    },
    sendWishList: function(req, res) {
        req.body.user_id = req.user.id;
        if (req.body.message) {
            WishList.create(req.body).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            req.json(401, Msg.getMessage(401, "Message required"))
        }
    }

}