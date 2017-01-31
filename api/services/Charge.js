module.exports = {
    getMessageHistoryByStartDateEndDate: function(startDate, endDate, company) {
        return function(done) {
            var condition = {
                "created_at": {
                    '>': startDate,
                    '<': endDate
                },
                company_id: company.id
            };
            return InboundsLogs.count(condition).then(function(inboundsCount) {
                Groups.getUserGroups(company.id).then(function(ids) {
                    condition.group_id = ids;
                    return GroupsUsersLogs.count({
                        "created_at": {
                            '>': startDate,
                            '<': endDate
                        },
                        group_id: ids,
                        sent_type: 1
                    }).then(function(logsCount) {
                        return done(null, inboundsCount + logsCount)
                    });
                })
            });
        }
    },
    increased: function(userData, count, amount) {
        return function(done) {
            var changeAmount = amount * 100
            return stripe.charges.create({
                amount: parseInt(changeAmount.toFixed(2)),
                currency: "usd",
                description: "DataOwl SMS Extra",
                customer: userData.stripe_user_id
            }, function(error, charge) {
                if (error) {
                    Users.update({
                        id: userData.id
                    }, {
                        update_card: 2,
                        debt: amount
                    }).exec(function(err, data) {
                        return done(error, null)
                    })
                }

                if (charge) {
                    UsersCharges.create({
                        user_id: userData.id,
                        pricing_id: userData.plan[0].id,
                        charge_amount: amount,
                        charge_id: charge.id,
                        keyword: CHARGE,
                        description: "Charge " + count + " messages"
                    }).exec(function(err, cahrge) {
                        if (err) return done(err, null)
                        if (userData.update_card == CHARGE) {
                            Users.update({
                                id: userData.id
                            }, {
                                update_card: 0,
                                debt: 0
                            }).exec(function(err, data) {
                                if (err) return done(err, null)

                                return done(null, cahrge)
                            })
                        }else{
                            return done(null, cahrge)
                        }

                    })
                }
            });
        }
    },
};