module.exports = {
    autoUpdatedAt: false,
    tableName: "inbounds",
    attributes: {
        record_id: {
            type: "String"
        },
        to: {
            type: "String"
        },
        from: {
            type: "String"
        },
        reviewed: {
            type: "boolean",
            defaultsTo: false
        },
        message: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        inboundsLogs: {
            collection: 'InboundsLogs',
            via: 'inbounds'
        },
        updatedAt: {
            columnName: "updated_at",
            type: "datetime"
        }
    },
    beforeCreate: function(values, cb) {
        values.from = OtherHelper.filterNumber(values.from);
        cb();
    },
    getUserInbounds: function(companyPhone) {
        var self = this;
        return new Promise(function(resolve) {
            self.find({
                to: companyPhone
            }).then(function(data) {
                resolve(data.map(function(group) {
                    return group.id
                }))
            })
        })
    },
    getDeactivatedUsersCount: function(month, phone) {
        return function(done) {
            return StopCodes.find().exec(function(err, data) {
                var codes = data.map(function(item) {
                    return item.code
                })
                return Inbounds.count({
                    "created_at": {
                        '>': month
                    },
                    "to": phone,
                    message: codes
                }, {
                    select: ['id']
                }).then(function(inbounds) {
                    return done(null, inbounds);
                })
            })
        }
    },
};