module.exports = {
    createReferralCode: function(req, res) {
        if (req.body.code) {
            ReferralCodes.findOne({
                code: req.body.code
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                if (data) {
                    res.json(409, Msg.getMessage(409, "This code existing please change code and try again"));
                } else {
                    var url = DOMAIN_URL + "home/" + req.body.code;
                    ReferralCodes.create({
                        code: req.body.code,
                        user_id: req.user.id,
                        url: url
                    }).exec(function(err, data) {
                        if (err) return res.serverError(err)

                        res.json(data)
                    })
                }
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateReferralCode: function(req, res) {
        if (req.body.code) {
            ReferralCodes.findOne({
                code: req.body.code
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                if (data) {
                    res.json(409, Msg.getMessage(409, "This code existing please change code and try again"));
                } else {
                    var url = DOMAIN_URL + "home/" + req.body.code;
                    ReferralCodes.update({
                        id: req.body.id
                    }, {
                        code: req.body.code,
                        user_id: req.user.id,
                        url: url
                    }).exec(function(err, data) {
                        if (err) return res.serverError(err)

                        res.json(data)
                    })
                }
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    deleteReferralCode: function(req, res) {
        ReferralCodes.update({
            id: req.body.id
        }, {
            status: 0
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getReferralCode: function(req, res) {
        ReferralCodes.find({
            user_id: req.user.id,
            status: 1
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getUsersByReferralCode: function(req, res) {
        if (req.body.code) {
            ReferralCodes.findOne({
                code: req.body.code
            }).exec(function(err, data) {

                if (err) return res.serverError(err)

                Users.find({
                    referral_id: data.id
                }, {
                    select: ['username', 'first_name', 'last_name', 'password', 'email', 'role_group_id', 'is_active', 'createdAt']
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
};