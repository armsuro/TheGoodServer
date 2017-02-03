module.exports = {
    tableName: 'ingridents',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: "string",
            required: true
        },
        parcent: {
            type: "integer",
            required: true
        },
        product_id: {
            type: "integer",
            required: true
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};