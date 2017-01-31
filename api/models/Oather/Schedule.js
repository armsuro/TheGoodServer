module.exports = {
    tableName: 'schedule',
    attributes: {
        name: {
            type: "string"
        },
        message: {
            type: "longtext",
            required: true
        },
        groups: {
            type: "string",
            required: true
        },
        urls: {
            type: "longtext"
        },
        company_id: {
            type: "integer",
            required: true
        },
        user_id: {
            type: "integer",
            required: true
        },
        repeat: {
            type: "integer"
        },
        select_time: {
            type: "string",
            required: true
        },
        sent_time: {
            type: "string",
            required: true
        },
        sented: {
            type: "boolean",
            defaultsTo: false
        },
        state: {
            type: "string"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        updatedAt: {
            columnName: "updated_at",
            type: "datetime"
        }
    }
};