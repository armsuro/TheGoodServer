module.exports = {
    attributes: {
        username: {
            type: "string",
            required: true,
            unique: true
        },
        first_name: {
            type: "string",
        },
        last_name: {
            type: "string",
        },
        password: {
            type: "string",
            required: true
        },
        email: {
            type: "string",
            required: true
        },
        role_group_id: {
            type: "integer"
        },
        token: {
            type: "string"
        },
        is_active: {
            type: "boolean",
            defaultsTo: true
        },
        secret_key: {
            type: 'string'
        },
        createdAt: {
            columnName: "created_at",
            type: "datetime"
        },
        updatedAt: {
            columnName: 'updated_at',
            type: "datetime"
        },
        role: {
            model: 'RoleGroup',
            columnName: 'role_group_id'
        }
    },
    beforeCreate: function(values, cb) {
        values.password = crypto.createHash('md5').update(values.password).digest("hex");
        cb();
    }
};