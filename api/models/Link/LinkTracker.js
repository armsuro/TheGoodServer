module.exports = {
    tableName: 'link_tracker',
    autoUpdatedAt: false,
    attributes: {
        group_id: {
            type: 'integer'
        },
        message_id: {
            type: 'integer'
        },
        url: {
            type: 'longtext'
        },
        encrypt: {
            type: "longtext"
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        logs: {
            collection: 'LinkTeackerLogs',
            via: 'track'
        }
    }
};