module.exports = {
    tableName: 'notifications',
    autoUpdatedAt: false,
    attributes: {
        message: {
            type: "longtext",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        deleted: {
            type: "boolean",
            defaultsTo: false
        },
        usersnotifiactions: {
            collection: 'UsersNotifications',
            via: 'notification'
        }
    }
};