module.exports = {
    tableName: 'about_us',
    autoUpdatedAt: false,
    attributes: {
        text: {
            type: "longtext",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};