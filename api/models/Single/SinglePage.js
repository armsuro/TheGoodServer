module.exports = {
    tableName: 'single_page',
    autoUpdatedAt: false,
    attributes: {
        company_id: {
            type: "integer",
            required: true
        },
        url_code: {
            type: "string",
            required: true
        },
        title: {
            type: "string"
        },
        description: {
            type: "longtext"
        },
        logo_url: {
            type: "string"
        },
        group_ids: {
            type: "string",
            required: true
        },
        style: {
            type: "longtext"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        company: {
            model: 'Company',
            columnName: 'company_id'
        },
    }
};