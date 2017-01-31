module.exports = {
    tableName: 'groups',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: 'String',
            required: true
        },
        keyword: {
            type: 'String'
        },
        author_id: {
            type: "integer",
            required: true
        },
        replay_message: {
            type: "longtext"
        },
        company_id: {
            type: 'integer'
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        groupsLogs: {
            collection: 'GroupsLogs',
            via: 'group'
        },
        groupUsers: {
            collection: 'GroupUsers',
            via: 'group'
        },
        groupsUsersLogs: {
            collection: 'GroupsUsersLogs',
            via: 'group'
        },
    },
    getUserGroups: function(companyId) {
        var self = this;
        return new Promise(function(resolve) {
            self.find({
                company_id: companyId
            }).then(function(data) {
                resolve(data.map(function(group) {
                    return group.id
                }))
            })
        })
    }
};