module.exports = {
    tableName: 'products',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: "string"
        },
        description: {
            type: "string",
            required: true
        },
        image: {
            type: "longtext",
            required: true
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        author_id: {
            type: 'integer'
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};