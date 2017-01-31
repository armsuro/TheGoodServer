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
        role: {
            model: 'RoleGroup',
            columnName: 'role_group_id'
        },
        company: {
            model: 'Company',
            columnName: 'company_id'
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
        stripe_user_id: {
            type: 'string'
        },
        stripe_user_token: {
            type: 'string'
        },
        stripe_subscription_id: {
            type: 'string'
        },
        stripe_card_id: {
            type: 'string'
        },
        reset_key: {
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
        update_card: {
            type: "integer"
        },
        debt: {
            type: "string"
        },
        company_id: {
            type: 'integer'
        },
        referral_id: {
            type: 'integer'
        },
        account_canceled: {
            type: "boolean",
            defaultsTo: false
        },
        plan: {
            collection: 'pricingplans',
            via: 'user',
            through: 'usersplans'
        },
        charge: {
            collection: 'userscharges',
            via: 'user',
            dominant: true
        }
    },
    beforeCreate: function(values, cb) {
        values.password = crypto.createHash('md5').update(values.password).digest("hex");
        cb();
    },
    getClientCounts: function(month) {
        return function(done) {
            return Users.count({
                role_group_id: CLIENT_ADMIN_ROLE_ID
            }).then(function(usersCount) {
                return done(null, usersCount);
            });
        }
    },
};