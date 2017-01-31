module.exports = {
    createQuiz: function(req, res) {
        if (req.body.quiz && req.body.questions) {
            OtherHelper.encrypt(Quiz, 3, 3).then(function(encrypt) {
                Quiz.create({
                    quiz: req.body.quiz.quiz,
                    code: encrypt,
                    author_id: req.user.id,
                    company_id: req.user.company.id
                }).exec(function(err, quiz) {
                    if (err) return res.serverError(err)

                    Promise.map(req.body.questions, function(question) {
                        OtherHelper.encrypt(QuizQuestions, 3, 3).then(function(encryptQuestion) {
                            QuizQuestions.create({
                                question: question.question,
                                code: encryptQuestion,
                                company_id: req.user.company.id,
                                quiz_id: quiz.id
                            }).exec(function(err, data) {
                                if (err) return res.serverError(err)
                            })
                        })
                    }).then(function(data) {
                        res.json(quiz)
                    })
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateQuiz: function(req, res) {
        var removeDeletes = function(ids) {
            QuizQuestions.query("UPDATE quiz_questions SET status= 0 WHERE quiz_id = ? AND id NOT IN (?)", [req.body.quiz.id, ids], function(err, data) {
                if (err) return res.serverError(err)

                res.json(200, Msg.getMessage(200))
            })

        }
        if (req.body.quiz && req.body.questions) {
            Quiz.update({
                id: req.body.quiz.id
            }, {
                quiz: req.body.quiz.quiz
            }).exec(function(err, data) {
                if (err) return res.serverError(err)
                Promise.map(req.body.questions, function(question) {
                    return new Promise(function(resolve, reject) {
                        if (question.id) {
                            QuizQuestions.update({
                                id: question.id
                            }, {
                                question: question.question,
                                status: true
                            }).exec(function(err, data) {
                                if (err) return res.serverError(err)
                                resolve(data[0].id)
                            })
                        } else {
                            OtherHelper.encrypt(QuizQuestions, 3, 3).then(function(encryptQuestion) {
                                QuizQuestions.create({
                                    question: question.question,
                                    code: encryptQuestion,
                                    company_id: req.user.company.id,
                                    quiz_id: req.body.quiz.id
                                }).exec(function(err, data) {
                                    if (err) return res.serverError(err)
                                    resolve(data.id)
                                })
                            })
                        }
                    })
                }).then(function(done) {
                    removeDeletes(done)
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    openUrl: function(req, res) {
        if (req.params.question && req.params.answer && req.params.user_code) {
            QuizAnswers.findOne({
                quiz_code: req.params.question,
                user_code: req.params.user_code
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                if (data) {
                    res.redirect(DOMAIN_URL)
                } else {
                    QuizAnswers.create({
                        quiz_code: req.params.question,
                        answer_code: req.params.answer,
                        user_code: req.params.user_code
                    }).exec(function(err, data) {
                        if (err) return res.serverError(err)

                        res.redirect(DOMAIN_URL)
                    })
                }
            })
        } else {
            res.redirect(DOMAIN_URL)
        }
    },
    getQuizzes: function(req, res) {
        Quiz.find({
            company_id: req.user.company.id,
            status: 1
        }).sort('id DESC').exec(function(err, quizzes) {
            if (err) return res.serverError(err)
            Promise.map(quizzes, function(quiz) {
                return new Promise(function(resolve, reject) {
                    QuizQuestions.find({
                        quiz_id: quiz.id,
                        status: 1
                    }).exec(function(err, questions) {
                        if (err) return res.serverError(err)

                        resolve({
                            "quiz": quiz,
                            "questions": questions
                        });
                    })
                })
            }).then(function(data) {
                res.json(data)
            })
        })

    },
    getQuiz: function(req, res) {
        if (req.body.id) {

            Quiz.findOne({
                id: req.body.id
            }).exec(function(err, quiz) {
                if (err) return res.serverError(err)

                QuizQuestions.find({
                    quiz_id: quiz.id,
                    status: true
                }).exec(function(err, questions) {
                    if (err) return res.serverError(err)

                    res.json({
                        "quiz": quiz,
                        "questions": questions
                    });
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    deleteQuiz: function(req, res) {
        if (req.body.id) {
            Quiz.update({
                id: req.body.id
            }, {
                status: 0
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            });
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    sendQuizToAllSupscribers: function(req, res) {
        var finishedRequests = 0;
        var allSubscribersCount = 0;
        var sendFinish = function(log_id) {
            finishedRequests++;
            if (finishedRequests == allSubscribersCount) {
                GroupsLogs.update({
                    id: log_id
                }, {
                    send_all_users: 1
                }).exec(function(err, data) {
                    if (err) return res.serverError(err)

                    sails.sockets.broadcast(req.user.company.phone, "finishMessages", {
                        report_id: log_id
                    });
                })
            }
        }

        if (req.body.group_id && req.body.quiz_id) {
            var sendMessage = function(message, encrypt) {
                var log_id;
                var sendedCount = 0;
                var notSendedCount = 0;
                Groups.findOne(req.body.group_id).exec(function(err, group) {
                    if (err) return res.serverError(err)

                    GroupUsers.find({
                        group_id: req.body.group_id,
                        status: 1
                    }).exec(function(err, users) {
                        allSubscribersCount = users.length;
                        GroupsLogs.create({
                            group_ids: req.body.group_id,
                            message: message,
                            company_id: req.user.company.id,
                            quiz: req.body.quiz_id,
                            quiz_code: encrypt,
                            name: req.body.name ? req.body.name : ''
                        }).exec(function(err, groupLog) {
                            log_id = groupLog.id
                            Promise.map(users, function(user) {

                                var message = groupLog.message.replace(/:userId/g, user.short_code)
                                var msg = {
                                    "to": user.phone,
                                    "from": req.user.company.phone,
                                    "content": message
                                };

                                flowrouteMessaging.MessagesController.createMessage(msg, req.user.company.vip, function(err, response) {
                                    if (response) {
                                        GroupsUsersLogs.create({
                                                group_id: req.body.group_id,
                                                company_id: req.user.company.id,
                                                log_id: log_id,
                                                user_id: user.id,
                                                quiz: true,
                                                record_id: response.data.id
                                            })
                                            .exec(function(err, data) {
                                                sendedCount = sendedCount + 1;
                                                sails.sockets.broadcast(req.user.company.phone, "groupSendedMessages", {
                                                    id: req.body.group_id,
                                                    sent_subscribers: sendedCount,
                                                    list_name: group.name,
                                                    all_subscribers: allSubscribersCount,
                                                    report_id: log_id
                                                });
                                                sendFinish(log_id)
                                            })
                                    } else {
                                        GroupsUsersLogs
                                            .create({
                                                group_id: req.body.group_id,
                                                log_id: log_id,
                                                user_id: user.id,
                                                quiz: true,
                                                sent_type: 0
                                            }).exec(function(err, log) {
                                                sendFinish(log_id)
                                            });
                                    }
                                });
                            })
                        })
                    })
                })
            }

            var createQuiz = function() {
                Quiz.findOne(req.body.quiz_id).exec(function(err, quiz) {
                    if (err) return res.serverError(err)

                    if (quiz) {
                        var message = req.body.message ? req.body.message + "\n" : quiz.quiz + "\n";
                        QuizQuestions.find({
                            quiz_id: quiz.id,
                            status: 1
                        }).exec(function(err, questions) {
                            if (err) return res.serverError(err)
                            OtherHelper.encrypt(GroupsLogs, 3, 4).then(function(encrypt) {
                                Promise.map(questions, function(question) {
                                    message += '\n' + question.question + " " + SHORT_URL + "/q/" + encrypt + "/" + question.code + "/:userId"
                                }).then(function(data) {
                                    sendMessage(message, encrypt)
                                })
                            })
                        })

                    }
                })
            }

            createQuiz()

            res.json(true)
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getUsersReports: function(req, res) {
        if (req.body.code && req.body.page && req.body.page.limit && req.body.page.currentPage) {
            QuizAnswers.count({
                answer_code: req.body.code.code
            }).exec(function(err, count) {
                if (err) return res.serverError(err)

                QuizAnswers.query('SELECT gu.id, gu.full_name, gu.phone, qa.created_at FROM quiz_answers qa LEFT JOIN group_users gu ON gu.short_code = qa.user_code WHERE qa.answer_code = ? AND qa.quiz_code = ? ' + OtherHelper.pagInation(req.body.page.currentPage, req.body.page.limit), [req.body.code.code, req.body.code.quiz_code], function(err, data) {
                    if (err) return res.serverError(err)

                    res.json({
                        count: count,
                        data: data
                    })
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
}