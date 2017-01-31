module.exports = {
    tableName: 'billing_informations',
    autoUpdatedAt: false,
    attributes: {
        user_id: {
            type: 'integer'
        },
        phone_number: {
            type: 'String'
        },
        address: {
            type: "String"
        },
        city: {
            type: "String"
        },
        state: {
            type: "String"
        },
        zip_code: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};