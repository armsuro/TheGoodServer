module.exports = {
    tableName: 'link_tracker_logs',
    autoUpdatedAt: false,
    attributes: {
        link_id: {
            type: 'integer'
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        group_id: {
            type: 'integer'
        },
        url: {
            type: 'string'
        },
        track: {
            model: 'LinkTracker',
            columnName: 'link_id'
        }
    }
};