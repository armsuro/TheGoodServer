module.exports = {
    getCuponCodes: function(req, res) {
        stripe.coupons.list(
            function(err, coupons) {
                if (err) return res.serverError(err)

                res.json(coupons.data)
            }
        );
    },
    createCoupon: function(req, res) {
        if (req.method == "POST") {
            req.body.currency = "usd";
            stripe.coupons.create(req.body, function(err, coupon) {
                if (err) return res.json(409, Msg.getMessage(409, err.message))

                res.json(coupon)
            });
        } else {
            res.json(["forever", "once", "repeating"])
        }
    },
    updateCoupon: function(req, res) {
        if (req.method == "POST") {
            stripe.coupons.update(req.body.id, {
                metadata: req.body
            }, function(err, data) {
                if (err) return res.json(409, Msg.getMessage(409, err.message))

                res.json(data)
            })
        } else {
            res.json(["forever", "once", "repeating"])
        }
    },
    deleteCoupon: function(req, res) {
        stripe.coupons.del(req.body.id, function(err, data) {
            if (err) return res.json(409, Msg.getMessage(409, err.message))

            res.json(data)
        })
    },
    getClients: function(req, res) {
        Users.query("SELECT u.id, u.username, u.account_canceled, c.name as company_name, c.phone as company_phone, c.id as company_id, pp.name as plan_name, pp.count as message_sent_count, pp.price as plan_price, up.created_at as charge_date, pp.one_message_price as message_price FROM users u LEFT JOIN users_plans up ON up.user_id = u.id LEFT JOIN company c ON u.company_id = c.id LEFT JOIN pricing_plans pp ON pp.id = up.pricing_id WHERE u.role_group_id = 1 ORDER BY pp.id", function(err, data) {
            if (err) return res.serverError(err);

            res.json(data)
        })
    },
    getDashboardData: function(req, res) {
        var month = new Date();
        month.setDate(1);
        month.setHours(0, 0, 0, 0);

        async.parallel({
            "clients_count": Users.getClientCounts(),
            "messages_sent_count": InboundsLogs.getAllMessagesCount(month)
        }, function(err, data) {
            if (err) return res.serverError(err);

            res.json(data);
        });
    },
    stripeCallback: function(req, res) {
        var charge = function(userData, count, amount) {
            async.parallel({
                "charge": Charge.increased(userData, count, amount),
            }, function(err, data) {
                if (err) return res.serverError(err);

                if (data) {
                    return true;
                }
            });
        }

        var calculate = function(userData) {
            var endDate = new Date(userData['charge'][0].createdAt);
            endDate.setMonth(endDate.getMonth() + 1);
            async.parallel({
                "chargeCount": Charge.getMessageHistoryByStartDateEndDate(userData['charge'][0].createdAt, endDate, userData.company),
            }, function(err, data) {
                if (err) return
                if (userData['charge'][0].keyword == CHARGE) {
                    var amount = data["chargeCount"] * userData['plan'][0].one_message_price;
                    var count = data["chargeCount"];
                } else {
                    var count = data["chargeCount"] - userData['plan'][0].count;
                    var amount = count * userData['plan'][0].one_message_price;
                }
                if (amount >= 0.50) {
                    charge(userData, count, amount)
                }
            });
        }
        if (req.body.type == 'customer.subscription.updated') {
            var dataObject = req.body.data.object;
            Users.findOne({
                stripe_user_id: dataObject.customer
            }).populate('company').populate('charge', {
                limit: 1,
                sort: 'id DESC'
            }).populate('plan').exec(function(err, userData) {
                if (err) return res.serverError(err)

                if (userData) {
                    if (dataObject.current_period_start && dataObject.current_period_end) {
                        var startDate = dataObject.current_period_start + "000";
                        var endDate = dataObject.current_period_end + "000";
                        PricingPlans.findOne({
                            name: dataObject.plan.id
                        }).exec(function(err, price) {
                            UsersPlans.update({
                                user_id: userData.id
                            }, {
                                createdAt: new Date(parseInt(startDate)),
                                end_date: new Date(parseInt(endDate)),
                                pricing_id: price.id
                            }).exec(function(err, planData) {
                                if (err) return res.serverError(err)

                                if (planData) {
                                    UsersCharges.create({
                                        user_id: userData.id,
                                        charge_amount: price.price,
                                        pricing_id: price.id,
                                        charge_id: "",
                                        keyword: MOUNTLY_CHARGE,
                                        description: "Montly " + dataObject.plan.id
                                    }).exec(function(err, data) {
                                        if (err) return res.serverError(err)
                                        if (userData.update_card == 1) {
                                            Users.update({
                                                company: userData.company.id
                                            }, {
                                                update_card: 0
                                            }).exec(function(err, data) {
                                                if (err) res.serverError(err)
                                            })
                                        }
                                        calculate(userData)
                                        res.json(200)
                                    })
                                }
                            })
                        })
                    } else {
                        res.json(400)
                    }
                } else {
                    res.json(400)
                }
            })
        } else {
            res.json(400)
        }
    },
    getUsersHistory: function(req, res) {
        Users.find({
            role_group_id: 1
        }).populate('company').populate('plan').populate('charge', {
            limit: 1,
            sort: 'id DESC'
        }).exec(function(err, usersData) {
            if (err) return res.serverError(err)
            Promise.map(usersData, function(userData) {
                return new Promise(function(resolve, reject) {
                    if (userData) {
                        var usersPlans = userData['plan'][0];
                        if (usersPlans) {
                            UsersPlans.findOne({
                                user_id: userData.id,
                                pricing_id: usersPlans.id
                            }).exec(function(err, userPlan) {
                                var returnObj = {}
                                var endDate = new Date(userPlan.createdAt);
                                var conditon = false;
                                endDate.setMonth(endDate.getMonth() + 1);
                                if (userData['charge'].length && userData['charge'][0].keyword == CHARGE) {
                                    var createdAt = userData['charge'][0].createdAt;
                                    returnObj.lasChargeDate = userData['charge'][0].createdAt;
                                } else {
                                    conditon = true;
                                    var createdAt = userPlan.createdAt;
                                    returnObj.lasChargeDate = userPlan.createdAt;
                                }
                                async.parallel({
                                    "allMonth": Charge.getMessageHistoryByStartDateEndDate(userPlan.createdAt, endDate, userData.company),
                                    "afterCharge": Charge.getMessageHistoryByStartDateEndDate(createdAt, endDate, userData.company)
                                }, function(err, data) {
                                    if (err) return res.serverError(err);
                                    if (data) {
                                        if (conditon && data.afterCharge > usersPlans.count) {
                                            var price = (data.afterCharge - usersPlans.count) * usersPlans.one_message_price;
                                            returnObj.chargePrice = price.toFixed(2)
                                            returnObj.chargeCount = (data.afterCharge - usersPlans.count)
                                        } else if ((data.allMonth - data.afterCharge) > usersPlans.count) {
                                            var price = data.afterCharge * usersPlans.one_message_price
                                            returnObj.chargePrice = price.toFixed(2)
                                            returnObj.chargeCount = data.afterCharge;
                                        } else {
                                            returnObj.chargePrice = 0
                                            returnObj.chargeCount = 0;
                                        }
                                        returnObj = Object.assign(returnObj, {
                                            allMessagesCount: data.allMonth,
                                            priceName: usersPlans.name,
                                            priceCount: usersPlans.count,
                                            userData: userData,
                                        })
                                        resolve(returnObj);
                                    }
                                });
                            })
                        } else {
                            reject()
                        }
                    }
                })
            }).then(function(response) {
                res.json(response);
            })

        })
    },
    chargeByUserId: function(req, res) {
        Users.findOne(req.body.user_id).populate('plan').exec(function(err, userData) {
            if (userData && userData.plan[0] && req.body.count) {
                var amount = (userData.plan[0].one_message_price * req.body.count);
                if (amount >= 0.50) {

                    async.parallel({
                        "charge": Charge.increased(userData, req.body.count, amount),
                    }, function(err, data) {
                        if (err) return res.json(400, err);

                        if (data) {
                            res.json(data)
                        }
                    });
                } else {
                    res.json(409, Msg.getMessage(409, "Minimal amount 50 Cent"))
                }
            } else {
                res.json(400, Msg.getMessage(400))
            }

        })
    },
    getUserPaymentsHistory: function(req, res) {
        if (req.body.stripe_user_id) {
            stripe.charges.list({
                    customer: req.body.stripe_user_id,
                    limit: 10000
                },
                function(err, payments) {
                    if (err) return res.serverError(err)
                    var data = []
                    if (payments.data) {
                        for (i in payments.data) {
                            data.push({
                                amount: payments.data[i].amount / 100,
                                date: new Date(parseInt(payments.data[i].created + "000")),
                                cart_number: "**** **** **** " + payments.data[i].source.last4,
                                description: payments.data[i].invoice ? "Monthly charge" : payments.data[i].description,
                                invoice: payments.data[i].invoice,
                                refunded: payments.data[i].refunded
                            })
                        }
                    }
                    res.json(data)
                }
            );
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getInvoiceDetails: function(req, res) {
        if (req.body.invoice) {
            stripe.invoices.retrieve(
                req.body.invoice,
                function(err, invoice) {
                    if (err) return res.serverError(err)

                    var data = {}
                    if (invoice) {
                        if (invoice.discount) {
                            data["discount"] = {
                                id: invoice.discount.coupon.id,
                                amount_off: invoice.discount.coupon.amount_off / 100,
                                duration: invoice.discount.coupon.duration,
                                duration_in_months: invoice.discount.coupon.duration_in_months,
                                percent_off: invoice.discount.coupon.percent_off
                            }
                            data["subtotal"] = invoice.subtotal / 100
                        }
                        if (invoice.lines.data[0]) {
                            if (invoice.lines.data[0].plan) {
                                data["plan"] = {
                                    name: invoice.lines.data[0].plan.name,
                                    interval: invoice.lines.data[0].plan.interval,
                                    interval_count: invoice.lines.data[0].plan.interval_count,
                                    amount: invoice.lines.data[0].plan.amount / 100
                                }
                            }

                            if (invoice.lines.data[0].period) {
                                data["period"] = {
                                    start: new Date(parseInt(invoice.lines.data[0].period.start + "000")),
                                    end: new Date(parseInt(invoice.lines.data[0].period.end + "000"))
                                }
                            }

                            data["total"] = invoice.total / 100

                        }
                    }


                    res.json(data)
                }
            );
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    findContuctUs: function(req, res) {
        ContuctUs.find().exec(function(err, data) {
            if (err) res.serverError(err)

            res.json(data)
        })
    },
    findWishList: function(req, res) {
        WishList.find().exec(function(err, data) {
            if (err) res.serverError(err)

            res.json(data)
        })
    },
    getClientInfo: function(req, res) {
        Users.findOne(req.body.user_id).populate('company').populate('plan').exec(function(err, userData) {
            if (err) res.serverError(err)

            res.json(userData)
        })
    },
    createStopCode: function(req, res) {
        StopCodes.findOrCreate({
            code: req.body.code
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    updateStopCode: function(req, res) {
        StopCodes.update({
            id: req.body.id
        }, {
            code: req.body.code
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    deleteStopCode: function(req, res) {
        StopCodes.destroy(req.body.id).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getStopCodes: function(req, res) {
        StopCodes.find().exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getClientReferrals: function(req, res) {
        ReferralCodes.find({
            user_id: req.body.user_id
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            var referralIds = data.map(function(item) {
                return item.id
            })

            Users.find({
                referral_id: referralIds
            }).populate('company').populate('plan').exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        })
    },
    getAllReferralUsers: function(req, res) {
        Users.find({
            role: REFERRAL_ROLE_ID,
            "is_active": 1
        }, {
            select: ['id', 'username', 'first_name', 'last_name', 'password', 'email', 'role_group_id', 'token', 'is_active', 'createdAt', 'updatedAt', 'update_card', 'debt', 'company_id', 'referral_id']
        }).populate('company').exec(function(err, users) {
            Promise.map(users, function(user) {
                return new Promise(function(resolve, reject) {
                    ReferralCodes.find({
                        user_id: user.id
                    }, {
                        select: ['id']
                    }).exec(function(err, ids) {
                        if (ids) {
                            var referralIds = ids.map(function(item) {
                                return item.id
                            })

                            Users.count({
                                referral_id: referralIds
                            }).exec(function(err, count) {
                                if (err) res.serverError(err)

                                user.referral_count = count;

                                resolve(user)
                            })
                        } else {
                            user.referral_count = 0;

                            resolve(user)
                        }
                    })
                });
            }).then(function(data) {
                res.json(data)
            })
        });
    },
    updateReferalUser: function(req, res) {
        if (req.body.id) {
            Users.update({
                'id': req.body.id
            }, {
                username: req.body.username,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body,
                is_active: req.body.is_active
            }).exec(function(err, data) {
                if (err) return res.json(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getAllSubscribersLists: function(req, res) {
        if (req.body.company_id) {
            Groups.query("SELECT g.name, g.keyword , g.author_id , g.replay_message , g.company_id , g.status, g.created_at, g.id, COUNT(gu.id) as subscribers_count FROM `groups` as g LEFT JOIN group_users as gu ON gu.group_id = g.id AND gu.status = 1 WHERE g.company_id = ? GROUP BY g.name, g.keyword , g.author_id , g.replay_message , g.company_id , g.status, g.created_at, g.id ORDER BY g.id DESC", [req.body.company_id], function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateSubscribersListStatus: function(req, res) {
        if (req.body.id && req.body.status) {
            Groups.update({
                id: req.body.id
            }, {
                status: parseInt(req.body.status)
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    writeLanguages: function(req, res) {
        if (req.body.languages) {
            fs.writeFile(sails.config.appPath + '/language/lang.json', JSON.stringify(req.body.languages), function(err) {
                if (err) return res.serverError(err);

                res.json(200, Msg.getMessage(200))
            });
        } else {
            res.json(200, Msg.getMessage(400))
        }
    },
    readLanguages: function(req, res) {
        var filePath = sails.config.appPath + '/language/lang.json'
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) return res.serverError(err)

                res.json(JSON.parse(data))
            });
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    createReplayMessage: function(req, res) {
        ReplayMessages.create(req.body).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getReplayMessages: function(req, res) {
        ReplayMessages.find().exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    updateReplayMessage: function(req, res) {
        if (req.body.id) {
            ReplayMessages.update({
                id: req.body.id
            }, {
                message: req.body.message,
                code: req.body.code,
                status: req.body.status
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    checkCodeUnique: function(req, res) {
        if (req.body.code) {
            ReplayMessages.findOne({
                code: req.body.code
            }, req.body).exec(function(err, data) {
                if (err) return res.serverError(err)

                if (data) {
                    res.json(409, Msg.getMessage(409, "Message code already exists"))
                } else {
                    res.json(200, Msg.getMessage(200))
                }
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    createNotification: function(req, res) {
        if (req.body.message) {
            Notifications.create({
                message: req.body.message
            }).exec(function(err, notification) {
                if (err) return res.serverError(err)

                Users.find({
                    role_group_id: {
                        "!": [REFERRAL_ROLE_ID,
                            SURPER_ADMIN_ROLE_ID
                        ]
                    }
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    if (data) {
                        Promise.map(data, function(user) {
                            UsersNotifications.create({
                                user_id: user.id,
                                notification_id: notification.id
                            }).exec(function(err, data) {})
                        }).then(function(done) {
                            res.json(200, Msg.getMessage(200))
                        })
                    }
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateNotification: function(req, res) {
        if (req.body.id && req.body.message) {
            Notifications.update({
                id: req.body.id
            }, {
                message: req.body.message
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    deleteNotification: function(req, res) {
        if (req.body.id) {
            Notifications.update({
                id: req.body.id
            }, {
                deleted: 1
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                UsersNotifications.update({
                    notification_id: req.body.id
                }, {
                    deleted: 1
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    res.json(data)
                })
            })
        }
    },
    getNotifications: function(req, res) {
        Notifications.find({
            deleted: true
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    changeClientPhoneNumber: function(req, res) {
        if (req.body.id && req.body.number) {
            Company.findOne(req.body.id).exec(function(err, company) {
                if (err) return res.serverError(err)
                Company.update({
                    phone: company.phone
                }, {
                    phone: req.body.number
                }).exec(function(err, updateCompany) {
                    if (err) return res.serverError(err)

                    PhoneNumbers.update({
                        number: company.phone
                    }, {
                        number: req.body.number
                    }).exec(function(err, phone) {
                        if (err) return res.serverError(err)

                        Inbounds.update({
                            to: company.phone
                        }, {
                            to: req.body.number
                        }).exec(function(err, data) {
                            if (err) return res.serverError(err)

                            res.json(Msg.getMessage(200))
                        })
                    })
                })
            })
        } else {
            res.json(Msg.getMessage(400))
        }
    },
    getCompanyList: function(req, res) {
        Company.find({
            select: ['name', 'phone']
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getDlrLogs: function(req, res) {
        if (req.body.page) {

            var condition = {}
            if (req.body.from) condition["from"] = req.body.from
            if (req.body.to) condition["to"] = "1" + req.body.to

            if (req.body.date && req.body.date.start_date && req.body.date.end_date) {
                condition["createdAt"] = {
                    '>': moment(new Date(req.body.date.start_date + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss'),
                    '<': moment(new Date(req.body.date.end_date + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss')
                }
            }

            DlrLogs.count(condition).exec(function(err, count) {
                if (err) return res.serverError(err)

                var obj = {
                    'count': count,
                    'data': []
                }

                DlrLogs.find(condition).paginate({
                    page: req.body.page.currentPage,
                    limit: req.body.page.limit
                }).sort('id DESC').exec(function(err, data) {
                    if (err) res.serverError(err);

                    obj.data = data;
                    res.json(obj);
                });
            })
        } else {
            res.json(Msg.getMessage(400))
        }
    },
    uploadSql: function(req, res) {
        req.file('file').upload({
            dirname: '../../protected_files/'
        }, function(error, uploadedFiles) {
            if (error) return res.serverError(error);

            var name = uploadedFiles[0].fd.split("protected_files/")[1];

            var filePath = sails.config.appPath + "/protected_files/" + name;

            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) {
                    sails.log.error(err);
                }

                var queries = data.split(';');

                for (var i in queries) {
                    Default.query(queries[i], function(err, records) {});
                }

                res.json(Msg.getMessage(200))
            });
        });
    }
}