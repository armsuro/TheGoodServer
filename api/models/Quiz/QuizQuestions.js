module.exports = {
    tableName: 'quiz_questions',
    autoUpdatedAt: false,
    attributes: {
        quiz_id: {
            type: 'integer',
            required: true
        },
        question: {
            type: "string",
            required: true
        },
        code: {
            type: "String",
            required: true,
            unique: true
        },
        company_id: {
            type: "integer",
            required: true
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