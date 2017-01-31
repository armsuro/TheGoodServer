module.exports = {
    getSchedules: function(req, res) {
        if (req.body.page && req.body.start_date && req.body.end_date && req.body.page.currentPage && req.body.page.limit) {
            Schedule.query("SELECT COUNT(*) as count FROM schedule WHERE DATE(select_time) BETWEEN ? AND ? AND company_id = ? AND sented = 0" + OtherHelper.pagInation(req.body.page.currentPage, req.body.page.limit), [moment(new Date(req.body.start_date)).format("YYYY-MM-DD"), moment(new Date(req.body.end_date)).format("YYYY-MM-DD"), req.user.company.id], function(err, count) {
                if (err) return res.serverError(err)
                Schedule.query("SELECT * FROM schedule WHERE DATE(select_time) BETWEEN ? AND ? AND company_id = ? AND sented = 0 " + OtherHelper.pagInation(req.body.page.currentPage, req.body.page.limit), [moment(new Date(req.body.start_date)).format("YYYY-MM-DD"), moment(new Date(req.body.end_date)).format("YYYY-MM-DD"), req.user.company.id], function(err, data) {
                    if (err) return res.serverError(err)

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
    getUserState: function(req, res) {
        BillingInformations.findOne({
            user_id: req.user.id
        }, {
            select: ['state']
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    removeSchedule: function(req, res) {
        if (req.body.id) {
            Schedule.destroy(req.body.id).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateSchedule: function(req, res) {
        if (req.body.id) {
            Schedule.update({
                id: req.body.id
            }, {
                name: req.body.name,
                groups: req.body.groups,
                state: req.body.state.code,
                message: req.body.message,
                sent_time: OtherHelper.getDateWithTimeZone(req.body.select_time, req.body.state.utc_time),
                select_time: moment(new Date(req.body.select_time)).format("YYYY:MM:DD HH-mm-ss")
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    sentJob: function(req, res) {
        var createSchedule = function(data) {
            delete data.id
            Schedule.create(data).exec(function(err, data) {
                if (err) return res.serverError(err)
            })
        }

        Schedule.query("SELECT * FROM schedule WHERE sent_time < NOW() AND sented = 0", function(err, data) {
            if (err) return res.serverError(err)
            Promise.map(data, function(message) {
                Message.sentCampain({}, message, true, message.select_time);
                Schedule.update({
                    id: message.id
                }, {
                    sented: 1
                }).exec(function(err, data) {

                    if (message.repeat) {
                        var type = message.repeat == 1 ? 'w' : 'M'
                        var newSelectTime = moment(new Date(message.select_time)).add(1, type).format("YYYY:MM:DD HH-mm-ss")
                        var newSentTime = moment(new Date(message.sent_time)).add(1, type).format("YYYY:MM:DD HH-mm-ss")
                        message["select_time"] = newSelectTime
                        message["sent_time"] = newSentTime
                        createSchedule(message)
                    }

                    if (err) return res.serverError(err)
                })
            }).then(function(done) {
                res.json(true)
            })
        })
    },
    saveSchedule: function(req, res) {
        req.body.company_id = req.user.company.id;
        req.body.user_id = req.user.id;
        req.body.sent_time = OtherHelper.getDateWithTimeZone(req.body.date_time, req.body.state.utc_time);
        req.body.select_time = moment(new Date(req.body.date_time)).format("YYYY:MM:DD HH-mm-ss");
        req.body.state = req.body.state.code;
        if (req.body.urls) req.body.urls = JSON.stringify(req.body.urls)

        Schedule.create(req.body).exec(function(err, data) {
            if (err) return res.serverError(err)
            res.json(data)
        })
    },
    getSchedule: function(req, res) {
        if (req.body.id) {
            Schedule.findOne(req.body.id).exec(function(err, data) {
                if (err) return res.serverError(err)

                var groups = data.groups.split(",");
                Groups.find({
                    id: groups,
                    status: 1
                }, {
                    select: ['id', 'name']
                }).exec(function(err, groups) {
                    data.groups = groups;
                    res.json(data)
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
}