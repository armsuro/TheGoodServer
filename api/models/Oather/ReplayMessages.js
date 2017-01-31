module.exports = {
    tableName: 'replay_messages',
    autoUpdatedAt: false,
    attributes: {
        message: {
            type: "longtext",
            required: true
        },
        code: {
            type: "string",
            required: true
        },
        status: {
            type: "boolean",
            defaultsTo: false
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};