module.exports = {
    createSinglePage: function(req, res) {
        req.body.company_id = req.user.company.id;
        if (req.body.url_code && req.body.group_ids) {
            SinglePage.create(req.body).exec(function(err, data) {
                if (err) return res.serverError(err);

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    deleteSinglePage: function(req, res) {
        if (req.body.id) {
            SinglePage.destroy(req.body.id).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(Msg.getMessage(400))
        }
    },
    updateSinglePage: function(req, res) {
        if (req.body.id) {
            SinglePage.update(req.body.id, req.body).exec(function(err, data) {
                if (err) return res.serverError(err);

                res.json(data)
            })
        } else {
            res.json(Msg.getMessage(400))
        }
    },
    getSinglePageData: function(req, res) {
        if (req.body.id) {
            SinglePage.findOne(req.body.id).exec(function(err, data) {
                if (err) return res.serverError(err)

                if (data) {
                    var group_ids = data.group_ids.split(",");
                    Groups.find({
                        id: group_ids,
                        status: 1
                    }, {
                        select: ['id', 'name']
                    }).exec(function(err, groups) {
                        data.group_ids = groups;
                        res.json(data)
                    })
                }
            })
        } else {
            res.json(Msg.getMessage(400))
        }
    },
    checkUrlCode: function(req, res) {
        if (req.body.url_code) {
            SinglePage.findOne({
                url_code: req.body.url_code
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                data ? res.json(401, Msg.getMessage(401, "This url existing")) : res.json(201)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getCompanySinglePages: function(req, res) {
        SinglePage.find({
            company_id: req.user.company.id
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    openSinglePage: function(req, res) {
        if (req.body.url_code) {
            SinglePage.findOne({
                url_code: req.body.url_code
            }).populate('company').exec(function(err, data) {
                if (err) return res.serverError(err)

                data ? res.json(data) : res.json(401, Msg.getMessage(401, "This url is not existing"))
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getThemes: function(req, res) {
        SinglePageThemes.find().exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    addUserInList: function(req, res) {
        if (req.body.id && req.body.phone) {
            SinglePage.findOne(req.body.id).exec(function(err, singleData) {
                var ids = singleData.group_ids.split(",");
                var fullName = req.body.full_name ? req.body.full_name : null;
                for (var i in ids) {
                    GroupUsers.findOne({
                        phone: OtherHelper.filterNumber(req.body.phone),
                        company_id: singleData.company,
                        group_id: ids[i]
                    }).exec(function(err, data) {
                        if (err) res.serverError(err)

                        if (!data) {

                            OtherHelper.createGroupUserLog({
                                group_id: ids[i],
                                company_id: singleData.company,
                            }).exec(function(err, log) {
                                if (err) return res.serverError(err);
                            })

                            GroupUsers.create({
                                phone: OtherHelper.filterNumber(req.body.phone),
                                company_id: singleData.company,
                                group_id: ids[i],
                                created_type: "Single page reginstration",
                                full_name: fullName
                            }).exec(function(err, data) {
                                if (err) res.serverError(err)
                            })
                        } else if (!data.status) {
                            GroupUsers.update({
                                id: data.id
                            }, {
                                status: 1,
                                full_name: fullName
                            }).exec(function(err, data) {
                                if (err) res.serverError(err)
                            })
                        } else if (data && data.status) {
                            GroupUsers.update({
                                id: data.id
                            }, {
                                full_name: fullName
                            }).exec(function(err, data) {
                                if (err) res.serverError(err)
                            })
                        }
                    })
                }
                res.json(200)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
}