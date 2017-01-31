module.exports = {
    tableName: 'dlr_logs',
    autoUpdatedAt: false,
    attributes: {
        from: {
            type: 'String'
        },
        to: {
            type: "String"
        },
        status: {
            type: "String"
        },
        json: {
            type: "longtext"
        },
        body: {
            type: "longtext"
        },
        type: {
            type: "String"
        },
        status_code: {
            type: "String"
        },
        flowroute_id: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        }
    }
};