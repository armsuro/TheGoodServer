module.exports = {
    tableName: 'group_users_logs',
    autoUpdatedAt: false,
    attributes: {
        group_id: {
            type: "integer",
            required: true
        },
        log_id: {
            type: "String"
        },
        user_id: {
            type: "integer",
            required: true
        },
        sent_type: {
            type: "boolean",
            defaultsTo: true
        },
        record_id: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        user: {
            model: 'GroupUsers',
            columnName: 'user_id'
        },
        group: {
            model: 'Groups',
            columnName: 'group_id'
        },
        quiz: {
            type: "boolean",
            defaultsTo: false
        },
        groupsLogs: {
            model: 'GroupsLogs',
            columnName: 'log_id'
        },
    },
    messagesCounts: function(month, companyId) {
        return function(done) {
            return Groups.getUserGroups(companyId).then(function(ids) {
                return GroupsUsersLogs.count({
                    "created_at": {
                        '>': month
                    },
                    group_id: ids,
                    sent_type: 1
                }).then(function(usersCont) {
                    return done(null, usersCont);
                });
            })
        }
    }
};