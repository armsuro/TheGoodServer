module.exports = {
    tableName: 'wish_list',
    autoUpdatedAt: false,
    attributes: {
        message: {
            type: "longtext",
            required: true
        },
        user_id: {
            type: "integer"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};