module.exports = {
    tableName: 'stop_codes',
    autoUpdatedAt: false,
    attributes: {
        code: {
            type: "longtext",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};