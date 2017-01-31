module.exports = {
    tableName: 'confirmation_logs',
    autoUpdatedAt: false,
    attributes: {
        group_id: {
            type: "integer",
            required: true
        },
        user_id: {
            type: "integer"
        },
        company_id: {
            type: "integer"
        },
        message: {
            type: "longtext"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};