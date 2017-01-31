module.exports = {
    autoUpdatedAt: false,
    tableName: "pricing_plans",
    attributes: {
        name: {
            type: "string"
        },
        count: {
            type: "integer"
        },
        price: {
            type: "integer"
        },
        one_message_price: {
            type: "float"
        },
        description: {
            type: "longtext"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};