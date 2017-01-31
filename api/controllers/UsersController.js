/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var extend = require('util')._extend;
var validateUser = function(user) {
    var password = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})")
    var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (password.test(user.password) && email.test(user.email)) {
        return true;
    } else {
        return false
    }
}
module.exports = {
    create: function(req, res) {
        if (validateUser(req.body)) {
            if (req.method == "POST") {
                Users.create(req.body).exec(function(err, users) {
                    if (err) return res.serverError(err);

                    return res.json(users);
                })
            } else {
                res.json(404, Msg.getMessage(404));
            }
        } else {
            res.json(409, Msg.getMessage(409, "Not valid email or password"));
        }
    },
    signIn: function(req, res) {
        if (req.method == "POST") {

            var username = req.body.username;
            var password = crypto.createHash('md5').update(req.body.password).digest("hex");
            Users.findOne({
                username: username,
                password: password,
                "is_active": 1
            }, {
                select: ['username', 'first_name', 'last_name', 'password', 'email', 'role_group_id', 'token', 'is_active', 'createdAt', 'updatedAt', 'update_card', 'debt', 'company_id', 'referral_id', 'stripe_user_id']
            }).populate('role').populate('company').exec(function(err, user) {
                if (err) return res.serverError(err);

                if (user) {
                    if (user.role.id == 3 && !req.body.manage) {
                        return res.json(409, Msg.getMessage(409, "Access Denied"));
                    } else if (user.role.id != 3 && req.body.manage) {
                        return res.json(409, Msg.getMessage(409, "Access Denied"));
                    } else {
                        UsersNotifications.find({
                            status: 0,
                            deleted: 0,
                            user_id: user.id
                        }).populate("notification").exec(function(err, data) {
                            if (err) return res.serverError(err)
                            user.notifications = data
                            var tokenText = Date.now() + user.username + user.id;
                            user.token = crypto.createHash('md5').update(tokenText).digest("hex");
                            var response = extend({}, user);
                            user.save(function(err) {
                                if (err) return res.serverError(err);
                                return res.json(response);
                            });
                        })

                    }
                } else {
                    return res.json(409, Msg.getMessage(409));
                }
            });
        }
    },
    getAllUsers: function(req, res) {
        Users.find({
            select: ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'role']
        }).populate('role').populate('company').exec(function(err, users) {
            if (err) return res.serverError(err);

            return res.json(users);
        })
    },
    getUsersAllData: function(req, res) {
        Users.find().populate('role').populate('company').exec(function(err, users) {
            if (err) return res.serverError(err);

            return res.json(users);
        })
    },
    changeUserInformation: function(req, res) {
        Users.update({
            "id": req.body.id
        }, req.body).exec(function(err, status) {
            if (err) return res.serverError(err);

            res.json(Msg.getMessage(200));
        });
    },
    getUserSubscribers: function(req, res) {
        GroupUsers.count({
            status: 1,
            company_id: req.user.company.id
        }).exec(function(err, data) {
            if (err) return res.serverError(err);

            res.json(data);
        })
    },
    getCompanyUsers: function(req, res) {
        Users.find({
            select: ['username', 'first_name', 'last_name', 'email', 'is_active', 'id', 'role_group_id'],
            company_id: req.body.company_id
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    updateUser: function(req, res) {
        Users.update({
            id: req.body.id
        }, req.body).exec(function(err, data) {
            if (err) res.serverError(err)

            res.json(data)
        })
    },
    registerForMessages: function(req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }
        
        sails.sockets.join(req, req.user.company.phone, function(err) {
            if (err) {
                return res.serverError(err);
            }

            return res.ok();
        });

    },
    getAccountInfo: function(req, res) {
        if (req.user.role == 1) {
            var getCartInfo = function() {
                return function(done) {
                    if (req.user.stripe_user_id && req.user.stripe_card_id) {
                        return stripe.customers.retrieveCard(
                            req.user.stripe_user_id,
                            req.user.stripe_card_id,
                            function(err, card) {
                                if (err) return done(err, null);
                                var returnData = {
                                    name: card.name,
                                    number: "************" + card.last4,
                                    exp_month: card.exp_month,
                                    exp_year: card.exp_year
                                }
                                return done(null, returnData)
                            }
                        );
                    } else {
                        return done(null, {})
                    }
                }
            }

            var getUserPlanInformation = function() {
                return function(done) {

                    Users.findOne(req.user.id).populate("plan").populate('charge', {
                        keyword: 1,
                        limit: 1,
                        sort: 'id DESC'
                    }).exec(function(err, data) {
                        if (err) return done(err, null)
                        var getUserPlans = function() {
                            return function(done) {
                                var returnObj = {
                                    id: data.plan[0].id,
                                    name: data.plan[0].name,
                                    count: data.plan[0].count,
                                    one_message_price: data.plan[0].one_message_price,
                                    start_date: moment(data.charge[0].createdAt, "MM/DD/YYYY")
                                }
                                return done(null, returnObj)
                            }
                        }
                        return async.parallel({
                            "userPlan": getUserPlans(),
                            "sent_count": InboundsLogs.getMessagesCount(data.charge[0].createdAt, req.user.company)
                        }, function(err, data) {
                            if (err) return done(err, null)

                            return done(null, data)
                        });
                    })
                }
            }

            var getDiscountInformation = function() {
                return function(done) {
                    return stripe.subscriptions.retrieve(
                        req.user.stripe_subscription_id,
                        function(err, subscription) {
                            if (err)
                                if (err) return done(err, null);
                            if (subscription.discount && subscription.discount.coupon && subscription.discount.coupon.id) {
                                return done(null, subscription.discount.coupon.id)
                            } else {
                                return done(null, "")
                            }
                        }
                    );
                }
            }

            async.parallel({
                "discount_code": getDiscountInformation(),
                "card": getCartInfo(),
                "price_plan": getUserPlanInformation()
            }, function(err, data) {
                if (err) return res.serverError(err);

                res.json(data);
            });
        } else {
            res.json({
                "discount_code": {},
                "card": {},
                "price_plan": {}
            })
        }
    },
    updateCardInfo: function(req, res) {
        stripe.customers.updateCard(
            req.user.stripe_user_id,
            req.user.stripe_card_id,
            req.body,
            function(err, card) {
                if (err) return res.json(err.message);

                res.json(card);
            }
        );
    },
    createNewCard: function(req, res) {
        if (req.user.stripe_user_id) {
            stripe.tokens.create({
                card: req.body
            }, function(err, token) {
                if (err) return res.json(409, Msg.getMessage(409, err.message))
                stripe.customers.createSource(
                    req.user.stripe_user_id, {
                        source: token.id
                    }
                ).then(function(card) {

                    if (req.user.stripe_user_id && req.user.stripe_card_id) {
                        stripe.customers.deleteCard(
                            req.user.stripe_user_id,
                            req.user.stripe_card_id,
                            function(err, confirmation) {
                                if (err) return res.json(409, Msg.getMessage(409, err.message))

                                Users.update({
                                    id: req.user.id
                                }, {
                                    stripe_card_id: card.id
                                }).then(function(userData) {
                                    if (userData[0].update_card == 2) {
                                        stripe.charges.create({
                                            amount: userData[0].debt * 100,
                                            currency: "usd",
                                            description: "DataOwl SMS Extra",
                                            customer: userData[0].stripe_user_id
                                        }, function(err, charge) {
                                            if (err) return res.json(409, Msg.getMessage(err.messages))
                                            Users.update({
                                                company_id: req.user.company.id
                                            }, {
                                                update_card: 0,
                                                debt: 0
                                            }).exec(function(err, data) {
                                                if (err) res.serverError(err)

                                                return res.json(Msg.getMessage(200));
                                            })
                                        });
                                    } else {
                                        res.json(Msg.getMessage(200, "Please try login in 5 minutes"));
                                    }
                                });
                            }
                        );
                    }
                });
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    changePricePlan: function(req, res) {
        PricingPlans.findOne(req.body.id).exec(function(err, data) {
            if (err) return res.serverError(err)

            if (data) {
                stripe.subscriptions.update(
                    req.user.stripe_subscription_id, {
                        plan: data.name
                    },
                    function(err, subscription) {
                        if (err) return res.serverError(err)

                        res.json(409, Msg.getMessage(409, "Your Pricing plan changed after completed your existing pricing plan"));
                    }
                );
            }
        });
    },
    generaterResetKey: function(req, res) {
        Users.findOne({
            username: req.body.username
        }).exec(function(err, user) {
            if (err) return res.serverError(err)

            if (user) {
                var encript = Crypt.encriptText(user.id + new Date())
                Email.getTemplate("ResetPassword", req.body.username, encript).then(function(html) {

                    var mailOptions = Email.configutarion();
                    mailOptions["to"] = user.email;
                    mailOptions["html"] = html;

                    mailerModule.send(mailOptions, function(err, result) {
                        user.reset_key = encript;
                        user.save(function(data) {})
                    });
                })
            }
            res.json(true)
        })
    },
    resetPassword: function(req, res) {
        if (req.method == "POST") {
            var password = crypto.createHash('md5').update(req.body.password).digest("hex");
            Users.update({
                reset_key: req.body.key
            }, {
                password: password,
                reset_key: ""
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            if (req.param('key')) {
                Users.findOne({
                    reset_key: req.param('key')
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    data ? res.json(Msg.getMessage(201)) : res.json(401, Msg.getMessage(401, "This key not exist"))
                })
            }
        }
    },
    updateDiscountCode: function(req, res) {
        var checkDiscount = function() {
            var discounts = {
                "ILOVEPLATINUM": 2,
                "ILOVESILVER": 1,
                "ILOVEGOLD": 3
            }
            if (req.body.discount_code && req.body.discount_code.length) {
                if (discounts[req.body.discount_code] && discounts[req.body.discount_code] == req.user.plan[0].id) {
                    stripe.coupons.retrieve(
                        req.body.discount_code,
                        function(err, upcoming) {
                            if (err) return res.json(409, Msg.getMessage(409, err.message));

                            change()
                        }
                    );
                } else {
                    return res.json(409, Msg.getMessage(409, "No such coupon"));
                }
            } else {
                change()
            }
        }

        var change = function() {
            stripe.subscriptions.update(
                req.user.stripe_subscription_id, {
                    coupon: req.body.discount_code
                },
                function(err, subscription) {
                    if (err) return res.json(409, Msg.getMessage(409, err.message))

                    res.json(Msg.getMessage(201))
                }
            );
        }

        checkDiscount()
    },
    deactivateSubscription: function(req, res) {
        if (req.user.role == 1) {
            stripe.subscriptions.del(
                req.user.stripe_subscription_id, {
                    at_period_end: true
                },
                function(err, confirmation) {
                    if (err) return res.json(409, Msg.getMessage(409, err.message))
                    Users.findOne(req.user.id).populate('plan').populate('charge', {
                        limit: 1,
                        sort: 'id DESC'
                    }).exec(function(err, user) {
                        if (err) return res.serverError(err);
                        async.parallel({
                            "messagesCount": InboundsLogs.getMessagesCount(user.charge[0].createdAt, req.user.company)
                        }, function(err, data) {
                            if (err) return res.serverError(err);

                            if (data['messagesCount'] >= user.plan[0].count) {
                                stripe.charges.create({
                                    amount: (data['messagesCount'] - user.plan[0].count) * 100,
                                    currency: "usd",
                                    description: "DataOwl SMS Extra",
                                    customer: user.stripe_user_id
                                }, function(err, charge) {
                                    if (err) return res.json(409, Msg.getMessage(err.messages))

                                    Users.update({
                                        id: user.id
                                    }, {
                                        is_actived: 0
                                    }).exec(function(err, data) {
                                        if (err) res.serverError(err)

                                        return res.json(200, Msg.getMessage(200));
                                    })
                                });
                            } else {
                                Users.update({
                                    id: user.id
                                }, {
                                    account_canceled: 1
                                }).exec(function(err, data) {
                                    if (err) res.serverError(err)

                                    return res.json(200, Msg.getMessage(200));
                                })
                            }
                        });
                    })
                }
            );
        } else {
            res.json(401, Msg.getMessage(401))
        }
    },
    changeCallbackUrl: function(req, res) {
        Company.update({
            id: req.user.company.id
        }, {
            callback_url: req.body.callback_url
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    changeLiveMessaginStatus: function(req, res) {
        Company.update({
            id: req.user.company.id
        }, {
            live_messaging: req.body.status
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    toggleClientMenu: function(req, res) {
        var id = req.user.role == SURPER_ADMIN_ROLE_ID ? req.body.id : req.user.id
        if (req.body.name && req.body.status) {
            Company.update({
                id: id
            }, {
                [req.body.name]: req.body.status
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    removeClient: function(req, res) {
        if (req.body.id) {
            Users.destroy(req.body.id).then(function(user) {
                var user = user[0];
                Company.destroy(user.company_id).then(function(company) {
                    PhoneNumbers.destroy({
                        number: company[0].phone
                    }).then(function(phone) {
                        UsersPlans.destroy({
                            user_id: user.id
                        }).then(function(plan) {
                            UsersCharges.destroy({
                                user_id: user.id
                            }).then(function(charges) {
                                BillingInformations.destroy({
                                    user_id: user.id
                                }).then(function(done) {
                                    res.json(user)
                                })
                            })
                        })
                    })
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    checkNotifiction: function(req, res) {
        if (req.data.id) {
            UsersNotifications.update({
                user_id: req.user.id,
                notification_id: req.data.id
            }, {
                status: 1
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateInfo: function(req, res) {
        if (req.body.id) {
            Users.findOne(req.body.id).exec(function(err, user) {
                if (err) return res.serverError(err)

                if (user.email != req.body.email) {
                    stripe.customers.update(user.stripe_user_id, {
                        email: req.body.email
                    }, function(err, customer) {

                    });
                }

                if (req.body.company_name && req.body.company_name != req.user.company.name) {
                    Company.update({
                        id: req.user.company.id
                    }, {
                        company_name: req.body.company_name
                    }).exec(function(err, data) {

                    })
                }

                Users.update({
                    id: user.id
                }, {
                    username: req.body.username,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    res.json(data)
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
};