module.exports = {
    tableName: 'quiz',
    autoUpdatedAt: false,
    attributes: {
        quiz: {
            type: 'longtext',
            required: true
        },
        code: {
            type: "String",
            required: true,
            unique: true
        },
        author_id: {
            type: "integer",
            required: true
        },
        company_id: {
        	type: 'integer',
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