module.exports = {
    tableName: 'contuct_us',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: "string"
        },
        email: {
            type: "string",
            required: true
        },
        message: {
            type: "longtext",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};