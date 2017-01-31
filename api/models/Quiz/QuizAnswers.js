module.exports = {
    tableName: 'quiz_answers',
    autoUpdatedAt: false,
    attributes: {
        quiz_code: {
            type: 'string',
            required: true
        },
        answer_code: {
            type: "string",
            required: true
        },
        user_code: {
            type: "string",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};