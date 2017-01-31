module.exports = {
    tableName: 'inbounds_logs',
    autoUpdatedAt: false,
    attributes: {
        phone: {
            type: "string",
            required: true
        },
        company_id: {
            type: "integer"
        },
        inbounds_id: {
            type: "integer"
        },
        record_id: {
            type: "String"
        },
        message: {
            type: "String"
        },
        user_message: {
            type: "boolean",
            defaultsTo: false
        },
        reviewed: {
            type: "boolean",
            defaultsTo: false
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        inbounds: {
            model: 'Inbounds',
            columnName: 'inbounds_id'
        },
    },
    beforeCreate: function(values, cb) {
        values.phone = OtherHelper.filterNumber(values.phone);
        cb();
    },
    getMessagesCount: function(month, company) {
        return function(done) {
            var condition = {
                "created_at": {
                    '>': month
                },
                "company_id": company.id
            };
            return InboundsLogs.count(condition).then(function(inboundsCount) {
                Groups.getUserGroups(company.id).then(function(ids) {
                    return GroupsUsersLogs.count({
                        "created_at": {
                            '>': month
                        },
                        group_id: ids,
                        sent_type: 1
                    }).then(function(logsCount) {
                        return done(null, inboundsCount + logsCount);
                    });
                })
            });
        }
    },
    getAllMessagesCount: function(month) {
        return function(done) {
            var condition = {
                "created_at": {
                    '>': month
                }
            };
            return InboundsLogs.count(condition).then(function(inboundsCount) {
                return GroupsUsersLogs.count({
                    "created_at": {
                        '>': month
                    },
                    sent_type: 1
                }).then(function(logsCount) {
                    return done(null, inboundsCount + logsCount);
                });
            });
        }
    },
    getInboundsCount: function(month, companyID) {
        return function(done) {
            var condition = {
                "created_at": {
                    '>': month
                },
                "company_id": companyID
            };
            return InboundsLogs.count(condition).then(function(inboundsCount) {
                return done(null, inboundsCount);
            });
        }
    }
};