module.exports = {
    tableName: 'users_notifications',
    autoUpdatedAt: false,
    attributes: {
        user_id: {
            type: "integer",
            required: true
        },
        status: {
            type: "boolean",
            defaultsTo: false
        },
        deleted: {
            type: "boolean",
            defaultsTo: false
        },
        notification_id: {
        	type: "integer"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        notification: {
            model: 'Notifications',
            columnName: 'notification_id'
        }
    }
};