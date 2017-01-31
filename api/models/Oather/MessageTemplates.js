module.exports = {
    tableName: 'message_templates',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: 'String'
        },
        message: {
            type: "longtext"
        },
        company_id: {
            type: "integer"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};