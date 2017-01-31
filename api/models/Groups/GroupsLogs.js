module.exports = {
    tableName: 'group_logs',
    autoUpdatedAt: false,
    attributes: {
        group_id: {
            type: "integer"
        },
        message: {
            type: "longtext"
        },
        name: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        group: {
            model: 'Groups',
            columnName: 'group_id'
        },
        groupsUsersLogs: {
            collection: 'GroupsUsersLogs',
            via: 'groupsLogs'
        },
        send_all_users: {
            type: "boolean",
            defaultsTo: false
        },
        company_id: {
            type: 'integer'
        },
        quiz: {
            type: "integer"
        },
        quiz_code: {
            type: "string"
        },
        dublicate_numbers: {
            type: "integer"
        },
        group_ids: {
            type: "string"
        },
        schedule_time: {
            type: "string"
        }
    }
};