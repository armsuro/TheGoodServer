module.exports = {
    tableName: 'phone_numbers',
    autoUpdatedAt: false,
    attributes: {
        number: {
            type: 'String'
        },
        payed: {
            type: "boolean",
            defaultsTo: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};