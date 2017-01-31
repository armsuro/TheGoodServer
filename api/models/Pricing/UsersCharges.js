module.exports = {
    tableName: "users_charges",
    attributes: {
        user_id: {
            type: "integer"
        },
        pricing_id: {
            type: "integer"
        },
        charge_id: {
            type: "string"
        },
        keyword: {
            type: "string"
        },
        charge_amount: {
            type: "string"
        },
        description: {
            type: "longtext"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        updatedAt: {
            columnName: "created_at",
            type: "datetime"
        },
        user: {
            model: 'users',
            columnName: 'user_id'
        }
    }
};
