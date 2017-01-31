module.exports = {
    tableName: 'sliders',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: "string"
        },
        description: {
            type: "longtext"
        },
        image_url: {
            type: "longtext",
            required: true
        },
        status: {
            type: "boolean",
            defaultsTo: true
        },
        position: {
            type: "string"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};