module.exports = {
    autoUpdatedAt: false,
    tableName: "users_plans",
    attributes: {
        user_id: {
            type: "integer"
        },
        pricing_id: {
            type: "integer"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        end_date: {
            type: "datetime"
        },
        user: {
            model: 'users',
            columnName: 'user_id',
        },
        plan: {
            model: 'pricingplans',
            columnName: 'pricing_id'
        }
    }
};