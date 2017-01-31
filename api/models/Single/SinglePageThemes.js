module.exports = {
    tableName: 'single_page_themes',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: "string"
        },
        styles: {
            type: "longtext"
        },
        icon: {
            type: "string"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};