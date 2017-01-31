module.exports = {
    reginstrationClients: function(req, res) {
        var purchaseNumber = function(stripe) {
            if (sails.config.environment === 'production' && !process.env.test_enabled) {
                var billingMethod = {
                    "billing_method": "METERED"
                };
                flowrouteNumbers.TelephoneNumbersController.purchase(billingMethod, req.body
                    .phone,
                    function(err, response) {
                        createCompany(stripe)
                    })
            } else {
                createCompany(stripe)
            }
        }
        var createCompany = function(stripe) {
            var stepCreateUser = req.body.user;
            Company.create({
                name: req.body.billing.company,
                phone: req.body.phone,
                ip_address: req.ip
            }).exec(function(err, companyData) {
                if (err) return res.serverError(err);
                stepCreateUser.company_id = companyData.id;
                stepCreateUser.stripe_user_id = stripe.stripe_user_id;
                stepCreateUser.stripe_user_token = stripe.stripe_user_token;
                stepCreateUser.stripe_subscription_id = stripe.stripe_subscription_id;
                stepCreateUser.stripe_card_id = stripe.stripe_card_id;
                if (req.body.referral_code) {
                    ReferralCodes.findOne({
                        code: req.body.referral_code
                    }).exec(function(err, data) {
                        if (data) {
                            stepCreateUser.referral_id = data.id;
                        }
                        createUser(stepCreateUser, stripe)
                    })
                } else {
                    createUser(stepCreateUser, stripe)
                }
            });
        }
        var createUser = function(stepCreateUser, stripe) {
            stepCreateUser.role = 1;
            Users.create(stepCreateUser).exec(function(err, data) {
                if (err) return res.serverError(err);
                if (data) checkPhone(data, stripe);
            })
        }
        var checkPhone = function(user, stripe) {
            PhoneNumbers.create({
                number: req.body.phone,
                payed: 1
            }).exec(function(err, data) {
                if (err) return res.serverError(err);
                if (data) checkPricengPlan(user, stripe)
            })
        }
        var checkPricengPlan = function(user, stripeObj) {
            UsersPlans.create({
                user_id: user.id,
                pricing_id: stripeObj.plan_id,
                createdAt: new Date(parseInt(stripeObj.start_date + "000")),
                end_date: new Date(parseInt(stripeObj.end_date + "000"))
            }).exec(function(err, data) {
                if (err) return res.serverError(err);
                if (data) {
                    UsersCharges.create({
                        user_id: user.id,
                        charge_amount: stripeObj.price,
                        pricing_id: data.id,
                        charge_id: "Monthly",
                        keyword: MOUNTLY_CHARGE,
                        description: "Monthly charge"
                    }).exec(function(err, data) {
                        if (err) return res.serverError(err);
                        if (data) {
                            billingInformation(user);
                        }
                    })
                }
            });
        }
        var billingInformation = function(user) {
            var billing = req.body.billing;
            billing.user_id = user.id;
            BillingInformations.findOne({
                user_id: user.id
            }).exec(function(err, data) {
                if (data) {
                    BillingInformations.update({
                        user_id: user.id
                    }, billing).exec(function(err, data) {
                        if (err) return res.serverError(err);
                        welcomeEmail(user)
                        res.json(user);
                    })
                } else {
                    BillingInformations.create(billing).exec(function(err, data) {
                        if (err) return res.serverError(err);
                        welcomeEmail(user)
                        res.json(user);
                    })
                }
            })
        }
        var purchase = function(obj) {
            PricingPlans.findOne(req.body.price_plan).then(function(plan) {
                obj.plan = plan.name;
                stripe.tokens.create({
                    card: req.body.card
                }, function(err, token) {
                    if (err) return res.json(401, Msg.getMessage(401, err.message))
                    stripe.customers.create({
                        source: token.id,
                        email: req.body.user.email,
                        description: req.body.user.username
                    }, function(err, customer) {
                        if (err) return res.json(401, Msg.getMessage(401, err.message))
                        obj.customer = customer.id;
                        stripe.subscriptions.create(obj, function(err, subscription) {
                            if (err) return res.json(401, Msg.getMessage(401, err.message))
                            var stripe = {
                                stripe_card_id: token.card.id,
                                stripe_user_id: customer.id,
                                stripe_user_token: token.id,
                                stripe_subscription_id: subscription.id,
                                plan_id: plan.id,
                                price: plan.price,
                                start_date: subscription.current_period_start,
                                end_date: subscription.current_period_end
                            }
                            purchaseNumber(stripe);
                        });
                    })
                });
            })
        };
        var checkDiscount = function() {
            var discounts = {
                "ILOVEPLATINUM": 2,
                "ILOVESILVER": 1,
                "ILOVEGOLD": 3
            }
            if (req.body.discount_code && req.body.discount_code.length) {
                if (discounts[req.body.discount_code] && discounts[req.body.discount_code] ==
                    req.body.price_plan) {
                    stripe.coupons.retrieve(
                        req.body.discount_code,
                        function(err, upcoming) {
                            if (err) return res.json(409, Msg.getMessage(409, err.message));
                            purchase({
                                coupon: req.body.discount_code
                            })
                        }
                    );
                } else {
                    return res.json(409, Msg.getMessage(409, "No such coupon"));
                }
            } else {
                purchase({})
            }
        }
        var validate = function() {
            var password = new RegExp(
                "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
            );
            var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            Users.findOne({
                username: req.body.user.username
            }).exec(function(err, data) {
                if (err) res.serverError(err)
                if (data) {
                    res.json(409, Msg.getMessage(409))
                } else {
                    if (password.test(req.body.user.password) && email.test(req.body.user
                            .email)) {
                        checkDiscount()
                    } else {
                        res.json(409, Msg.getMessage(409, "Not valid email or password"))
                    }
                }
            })
        }
        var welcomeEmail = function(user) {
            Email.getTemplate("WelcomeEmail", user.username).then(function(html) {
                var mailOptions = Email.configutarion();
                mailOptions["to"] = user.email;
                mailOptions["html"] = html;

                mailerModule.send(mailOptions, function(err, result) {

                });
            })
        }
        validate()
    },
    getPhoneList: function(req, res) {
        PhoneNumbers.find().exec(function(err, data) {
            if (err) res.serverError(err)
            res.json(data);
        })
    },
    getPricingPlans: function(req, res) {
        PricingPlans.find().exec(function(err, data) {
            if (err) res.serverError(err);
            res.json(data);
        });
    },
    checkUsername: function(req, res) {
        Users.findOne({
            select: ['id', 'username'],
            username: req.body.username
        }).exec(function(err, user) {
            if (err) return res.serverError(err);
            return user ? res.json(409, Msg.getMessage(409,
                "Username already exists")) : res.json(200, Msg.getMessage(200));
        })
    },
    getNpasCodes: function(req, res) {
        if (req.body && req.body.limit && req.body.page) {
            flowrouteNumbers.PurchasablePhoneNumbersController.listAvailableNPAs(req.body
                .limit, req.body.page,
                function(err, response) {
                    if (err) return res.serverError(err)
                    if (response["npas"]) {
                        for (i in response["npas"]) {
                            NpasCodes.findOrCreate({
                                "npas": i
                            }, {
                                "npas": i
                            }).exec(function(err, data) {})
                        }
                    }
                    res.json(true)
                })
        } else {
            NpasCodes.find({
                select: ["npas"]
            }).exec(function(err, data) {
                if (err) return res.serverError(err);
                var npas = data.map(function(item) {
                    return item.npas
                })
                res.json(npas)
            })
        }
    },
    getAreaList: function(req, res) {
        var body = req.body;
        body.page = req.body.phone ? req.body.phone : 1;
        flowrouteNumbers.PurchasablePhoneNumbersController.listAreaAndExchange(200,
            body.npa, body.page,
            function(err, response) {
                if (err) res.serverError(err)
                res.json(response);
            })
    },
    searchFullNumber: function(req, res) {
        var body = req.body;
        body.page = req.body.phone ? req.body.phone : 1;
        flowrouteNumbers.PurchasablePhoneNumbersController.search(100, body.npaxss,
            null, body.page, null, null, null,
            function(err, response) {
                if (err) res.serverError(err)

                res.json(response);
            })
    }
}