/**
 * RoleGroup.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: "role_groups",
    attributes: {
        name: {
            type: "String",
            required: true
        },
        users: {
            collection: 'Users',
            via: 'role'
        }
    }
};