module.exports = function(req, res, next) {
    if (req.user.update_card) {
        res.json(403, {
            "update_card": true
        })
    } else {
        if (req.user.role == 1) {
            UsersPlans.findOne({
                user_id: req.user.id
            }).exec(function(err, data) {
                if (err) res.serverError(err)

                if (data) {
                    var endDate = Number(new Date(data.end_date));
                    var newDate = Number(new Date());

                    if (endDate < newDate) {
                        Users.update({company_id: req.user.company.id}, {
                            update_card: 1
                        }).exec(function(err, data) {
                            res.json(403, {
                                "update_card": true
                            })
                        })
                    }
                    else
                        next();
                } else {
                    res.json(403, {
                        "update_card": true
                    })
                }
            })
        } else {
            next();
        }
    }
};