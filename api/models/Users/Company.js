module.exports = {
    tableName: 'company',
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: 'String'
        },
        phone: {
            type: "String"
        },
        ip_address: {
            type: "String"
        },
        callback_url: {
            type: "String"
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        users: {
            collection: 'Users',
            via: 'company'
        },
        live_messaging: {
            type: "boolean",
            defaultsTo: true
        },
        quiz: {
            type: "boolean",
            defaultsTo: true
        },
        vip: {
            type: "boolean",
            defaultsTo: false
        },
        schedule: {
            type: "boolean",
            defaultsTo: false
        },
        singlePage: {
            collection: 'SinglePage',
            via: 'company'
        }
    }
};