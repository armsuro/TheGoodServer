module.exports = {
    autoUpdatedAt: false,
    tableName: "referral_codes",
    attributes: {
        user_id: {
            type: "integer",
            required: true
        },
        code: {
            type: "string",
            required: true
        },
        url: {
            type: "string"
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};