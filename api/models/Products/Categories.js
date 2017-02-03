module.exports = {
    tableName: 'categories',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: "string",
            required: true
        },
        author_id: {
        	type: "string",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        products: {
            collection: 'Products',
            via: 'categories'
        }
    }
};