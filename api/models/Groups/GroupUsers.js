module.exports = {
    tableName: 'group_users',
    autoUpdatedAt: false,
    attributes: {
        group_id: {
            type: "integer",
            required: true
        },
        full_name: {
            type: "String"
        },
        reference_id: {
            type: "String"
        },
        phone: {
            type: "String",
            required: true
        },
        company_id: {
            type: "integer"
        },
        short_code: {
            type: "String"
        },
        created_type: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        groupsUsersLogs: {
            collection: 'GroupsUsersLogs',
            via: 'user'
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        group: {
            model: 'Groups',
            columnName: 'group_id'
        }
    },
    beforeCreate: function(values, cb) {
        OtherHelper.encrypt(GroupUsers, 4, 2).then(function(code) {
            values.short_code = code;
            values.phone = OtherHelper.filterNumber(values.phone);
            cb();
        })
    },
    afterCreate: function(values, cb) {
        this.findOne({
            company_id: values.company_id,
            phone: values.phone,
            id: {
                "!": values.id
            }
        }).exec(function(err, data) {
            if (!data) {
                Company.findOne(values.company_id).exec(function(err, company) {
                    Message.send(values.phone, company.phone, values.id, values.group, company, null, "welcome")
                })
            }
        })
        cb()
    },
    newGoupUsersCounts: function(month, companyId) {
        return function(done) {
            return GroupUsers.count({
                "created_at": {
                    '>': month
                },
                company_id: companyId,
                status: 1
            }).then(function(usersCont) {
                return done(null, usersCont);
            });
        }
    }
};